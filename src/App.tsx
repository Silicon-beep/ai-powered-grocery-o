import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { 
  ChartLine, 
  Package, 
  Users, 
  Tag, 
  ShieldWarning,
  Layout,
  Lightning
} from '@phosphor-icons/react'
import { OperationsOverview } from '@/components/views/OperationsOverview'
import { InventoryView } from '@/components/views/InventoryView'
import { WorkforceView } from '@/components/views/WorkforceView'
import { PricingView } from '@/components/views/PricingView'
import { LossPreventionView } from '@/components/views/LossPreventionView'
import { ProductPlacementView } from '@/components/views/ProductPlacementView'
import { AIChatWindow } from '@/components/AIChatWindow'
import { storeApi } from '@/lib/api-service'
import { useApiData } from '@/hooks/use-api-data'

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isChatOpen, setIsChatOpen] = useState(false)

  const { data: store } = useApiData(storeApi.getInfo)

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      
      <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary">
                  <Lightning size={24} className="text-primary-foreground" weight="fill" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">StoreAI</h1>
                  <p className="text-xs text-muted-foreground">Grocery Management Platform</p>
                </div>
              </div>
              <div className="h-8 w-px bg-border ml-2" />
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-semibold">{store?.name || 'Loading...'}</p>
                  <p className="text-xs text-muted-foreground">Store #{store?.storeNumber || '—'} • {store?.region || '—'}</p>
                </div>
                <Badge variant="outline" className="bg-success/10 text-success border-success">
                  Active
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="bg-accent/10 text-accent-foreground border-accent hover:bg-accent/20"
              >
                <Lightning size={12} weight="fill" className="mr-1" />
                AI Agents Active
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <Card className="p-2">
            <TabsList className="w-full grid grid-cols-6 h-auto">
              <TabsTrigger value="overview" className="flex items-center gap-2 py-3">
                <ChartLine size={18} weight="bold" />
                <span className="hidden md:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex items-center gap-2 py-3">
                <Package size={18} weight="bold" />
                <span className="hidden md:inline">Inventory</span>
              </TabsTrigger>
              <TabsTrigger value="workforce" className="flex items-center gap-2 py-3">
                <Users size={18} weight="bold" />
                <span className="hidden md:inline">Workforce</span>
              </TabsTrigger>
              <TabsTrigger value="pricing" className="flex items-center gap-2 py-3">
                <Tag size={18} weight="bold" />
                <span className="hidden md:inline">Pricing</span>
              </TabsTrigger>
              <TabsTrigger value="loss" className="flex items-center gap-2 py-3">
                <ShieldWarning size={18} weight="bold" />
                <span className="hidden md:inline">Loss Prevention</span>
              </TabsTrigger>
              <TabsTrigger value="placement" className="flex items-center gap-2 py-3">
                <Layout size={18} weight="bold" />
                <span className="hidden md:inline">Placement</span>
              </TabsTrigger>
            </TabsList>
          </Card>

          <TabsContent value="overview" className="mt-6">
            <OperationsOverview />
          </TabsContent>

          <TabsContent value="inventory" className="mt-6">
            <InventoryView />
          </TabsContent>

          <TabsContent value="workforce" className="mt-6">
            <WorkforceView />
          </TabsContent>

          <TabsContent value="pricing" className="mt-6">
            <PricingView />
          </TabsContent>

          <TabsContent value="loss" className="mt-6">
            <LossPreventionView />
          </TabsContent>

          <TabsContent value="placement" className="mt-6">
            <ProductPlacementView />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border mt-12 bg-card">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>© 2024 StoreAI. AI-Powered Grocery Management Platform.</p>
            <p>Optimizing Customer Lifetime Value through Operational Excellence</p>
          </div>
        </div>
      </footer>

      <AIChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}

export default App