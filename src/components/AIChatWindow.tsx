import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { 
  X, 
  PaperPlaneRight, 
  Lightning,
  User,
  Robot
} from '@phosphor-icons/react'
import { AZURE_AI_CONFIG } from '@/lib/azure-ai-config'
import { aiAgentApi, inventoryApi, workforceApi, pricingApi, placementApi, metricsApi } from '@/lib/api-service'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIChatWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function AIChatWindow({ isOpen, onClose }: AIChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your StoreAI assistant. How can I help you manage your grocery store today?',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const sendMessageToAzureAI = async (userMessage: string): Promise<string> => {
    const { endpoint, apiKey, deploymentName, apiVersion } = AZURE_AI_CONFIG

    if (!endpoint || !apiKey || !deploymentName) {
      return await handleMessageWithDatabaseContext(userMessage)
    }

    const url = `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`

    const conversationHistory = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    conversationHistory.push({
      role: 'user',
      content: userMessage
    })

    const databaseContext = await fetchDatabaseContext(userMessage)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI assistant for StoreAI, a grocery management platform. Help store managers with inventory, workforce, pricing, loss prevention, and product placement questions. Be concise and actionable.
            
You have access to real-time database information. When answering questions, reference the provided data context when relevant.

Database Context:
${databaseContext}`
          },
          ...conversationHistory
        ],
        max_tokens: 800,
        temperature: 0.7,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `Azure AI API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'No response from AI'
  }

  const fetchDatabaseContext = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase()
    let context = ''

    try {
      if (lowerMessage.includes('inventory') || lowerMessage.includes('stock')) {
        const inventory = await inventoryApi.getAll()
        const lowStockItems = inventory.filter(item => item.aiInsights.stockStatus === 'low' || item.aiInsights.stockStatus === 'critical')
        context += `\n\nCurrent Inventory Status:\n- Total items: ${inventory.length}\n- Low/Critical stock items: ${lowStockItems.length}\n- Top concerns: ${lowStockItems.slice(0, 3).map(item => `${item.productName} (${item.currentStock} ${item.unitOfMeasure})`).join(', ')}`
      }

      if (lowerMessage.includes('pricing') || lowerMessage.includes('price')) {
        const pricing = await pricingApi.getRecommendations()
        context += `\n\nPricing Recommendations:\n- Total recommendations: ${pricing.length}\n- High priority items: ${pricing.filter(p => p.urgency === 'high').length}`
      }

      if (lowerMessage.includes('staff') || lowerMessage.includes('workforce') || lowerMessage.includes('schedule')) {
        const shifts = await workforceApi.getShifts()
        const forecast = await workforceApi.getHourlyForecast()
        const understaffedHours = forecast.filter(f => f.coverageStatus === 'understaffed').length
        context += `\n\nWorkforce Status:\n- Scheduled shifts today: ${shifts.length}\n- Understaffed hours: ${understaffedHours}`
      }

      if (lowerMessage.includes('metric') || lowerMessage.includes('performance') || lowerMessage.includes('overview')) {
        const metrics = await metricsApi.getOperational()
        context += `\n\nKey Metrics:\n- CLV: ${metrics.clv.value} (${metrics.clv.change !== undefined && metrics.clv.change > 0 ? '+' : ''}${metrics.clv.change ?? 0}%)\n- Revenue: ${metrics.revenue.value} (${metrics.revenue.change !== undefined && metrics.revenue.change > 0 ? '+' : ''}${metrics.revenue.change ?? 0}%)\n- Stockouts: ${metrics.stockouts.value}`
      }
    } catch (error) {
      console.error('Error fetching database context:', error)
    }

    return context || 'No specific database context available for this query.'
  }

  const handleMessageWithDatabaseContext = async (userMessage: string): Promise<string> => {
    try {
      const response = await aiAgentApi.chat([
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage }
      ])
      
      return response.response
    } catch (error) {
      console.error('Error with AI agent API:', error)
      
      const context = await fetchDatabaseContext(userMessage)
      
      return `I understand you're asking about: "${userMessage}"\n\nHere's what I found in the database:\n${context}\n\nNote: Full AI responses require Azure OpenAI configuration in azure-ai-config.ts`
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const aiResponse = await sendMessageToAzureAI(userMessage.content)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message to Azure AI:', error)
      toast.error('Failed to get AI response. Please check your Azure AI configuration.')
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting to the AI service. Please ensure your Azure AI credentials are properly configured in `src/lib/azure-ai-config.ts`.',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)]"
        >
          <Card className="shadow-2xl border-2 border-border overflow-hidden">
            <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary-foreground/20">
                  <Lightning size={18} weight="fill" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AI Assistant</h3>
                  <Badge 
                    variant="outline" 
                    className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 text-xs h-5 px-1.5"
                  >
                    {isLoading ? 'Thinking...' : 'Online'}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
              >
                <X size={18} weight="bold" />
              </Button>
            </div>

            <div className="h-[500px] flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                          <Robot size={18} weight="fill" className="text-accent-foreground" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[75%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>

                      {message.role === 'user' && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                          <User size={18} weight="fill" className="text-secondary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                        <Robot size={18} weight="fill" className="text-accent-foreground" />
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="border-t border-border p-4">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask about inventory, pricing, staff..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    size="icon"
                    className="flex-shrink-0"
                  >
                    <PaperPlaneRight size={18} weight="fill" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
