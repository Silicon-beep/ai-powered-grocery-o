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
  Robot,
  Sparkle
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
          transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-8 right-8 z-50 w-[440px] max-w-[calc(100vw-4rem)]"
        >
          <Card className="shadow-2xl border-2 border-primary/30 overflow-hidden backdrop-blur-xl bg-card/95">
            <div className="bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground p-5 flex items-center justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
              <div className="flex items-center gap-3 relative z-10">
                <motion.div 
                  className="p-2 rounded-xl bg-primary-foreground/20 backdrop-blur-sm shadow-lg"
                  animate={{ 
                    boxShadow: ['0 0 0 0 rgba(255,255,255,0.4)', '0 0 0 8px rgba(255,255,255,0)'],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkle size={20} weight="fill" className="text-primary-foreground" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-base font-heading">AI Assistant</h3>
                  <Badge 
                    variant="outline" 
                    className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/40 text-xs h-5 px-2 font-bold"
                  >
                    {isLoading ? 'Thinking...' : 'Online'}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/20 relative z-10 transition-transform hover:scale-110"
              >
                <X size={20} weight="bold" />
              </Button>
            </div>

            <div className="h-[520px] flex flex-col">
              <ScrollArea className="flex-1 p-5">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex gap-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-md">
                          <Robot size={20} weight="fill" className="text-primary-foreground" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[80%] rounded-2xl p-4 shadow-md ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground'
                            : 'bg-muted/70 text-foreground border-2 border-border'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap font-medium leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-2 font-mono ${message.role === 'user' ? 'opacity-80' : 'opacity-60'}`}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>

                      {message.role === 'user' && (
                        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-secondary to-warning flex items-center justify-center shadow-md">
                          <User size={20} weight="fill" className="text-secondary-foreground" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3 justify-start"
                    >
                      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-md">
                        <Robot size={20} weight="fill" className="text-primary-foreground" />
                      </div>
                      <div className="bg-muted/70 border-2 border-border rounded-2xl p-4">
                        <div className="flex gap-1.5">
                          <motion.div 
                            className="w-2.5 h-2.5 rounded-full bg-primary" 
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                          />
                          <motion.div 
                            className="w-2.5 h-2.5 rounded-full bg-accent" 
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                          />
                          <motion.div 
                            className="w-2.5 h-2.5 rounded-full bg-primary" 
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="border-t-2 border-border bg-muted/30 p-4">
                <div className="flex gap-3">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask about inventory, pricing, staff..."
                    disabled={isLoading}
                    className="flex-1 border-2 focus-visible:ring-2 font-medium"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    size="icon"
                    className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg transition-transform hover:scale-110"
                  >
                    <PaperPlaneRight size={20} weight="fill" />
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
