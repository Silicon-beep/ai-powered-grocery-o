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
      
      <header className="border-b-2 border-primary/20 bg-card/80 backdrop-blur-xl sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
                  <Lightning size={28} className="text-primary-foreground" weight="fill" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight font-heading">StoreAI</h1>
                  <p className="text-xs text-muted-foreground font-medium">Grocery Management Platform</p>
                </div>
              </div>
              <div className="h-10 w-px bg-gradient-to-b from-transparent via-border to-transparent ml-2" />
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-bold font-heading">{store?.name || 'Loading...'}</p>
                  <p className="text-xs text-muted-foreground font-mono">Store #{store?.storeNumber || '—'} • {store?.region || '—'}</p>
                </div>
                <Badge variant="outline" className="bg-success/15 text-success border-success font-bold shadow-sm">
                  Active
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="bg-gradient-to-r from-accent/20 to-primary/20 text-accent-foreground border-2 border-accent hover:from-accent/30 hover:to-primary/30 font-bold shadow-md transition-all hover:shadow-lg hover:scale-105"
              >
                <Lightning size={16} weight="fill" className="mr-2" />
                AI Agents Active
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <Card className="p-2 shadow-lg border-2 border-primary/10 bg-gradient-to-r from-card via-primary/5 to-card">
            <TabsList className="w-full grid grid-cols-6 h-auto gap-2 bg-transparent p-1">
              <TabsTrigger 
                value="overview" 
                className="flex items-center gap-2 py-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-bold transition-all hover:scale-105"
              >
                <ChartLine size={20} weight="bold" />
                <span className="hidden md:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="inventory" 
                className="flex items-center gap-2 py-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-bold transition-all hover:scale-105"
              >
                <Package size={20} weight="bold" />
                <span className="hidden md:inline">Inventory</span>
              </TabsTrigger>
              <TabsTrigger 
                value="workforce" 
                className="flex items-center gap-2 py-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-bold transition-all hover:scale-105"
              >
                <Users size={20} weight="bold" />
                <span className="hidden md:inline">Workforce</span>
              </TabsTrigger>
              <TabsTrigger 
                value="pricing" 
                className="flex items-center gap-2 py-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-bold transition-all hover:scale-105"
              >
                <Tag size={20} weight="bold" />
                <span className="hidden md:inline">Pricing</span>
              </TabsTrigger>
              <TabsTrigger 
                value="loss" 
                className="flex items-center gap-2 py-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-bold transition-all hover:scale-105"
              >
                <ShieldWarning size={20} weight="bold" />
                <span className="hidden md:inline">Loss Prevention</span>
              </TabsTrigger>
              <TabsTrigger 
                value="placement" 
                className="flex items-center gap-2 py-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-bold transition-all hover:scale-105"
              >
                <Layout size={20} weight="bold" />
                <span className="hidden md:inline">Placement</span>
              </TabsTrigger>
            </TabsList>
          </Card>

          <TabsContent value="overview" className="mt-8">
            <OperationsOverview />
          </TabsContent>

          <TabsContent value="inventory" className="mt-8">
            <InventoryView />
          </TabsContent>

          <TabsContent value="workforce" className="mt-8">
            <WorkforceView />
          </TabsContent>

          <TabsContent value="pricing" className="mt-8">
            <PricingView />
          </TabsContent>

          <TabsContent value="loss" className="mt-8">
            <LossPreventionView />
          </TabsContent>

          <TabsContent value="placement" className="mt-8">
            <ProductPlacementView />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t-2 border-primary/20 mt-16 bg-gradient-to-r from-card via-primary/5 to-card backdrop-blur-sm">
        <div className="container mx-auto px-8 py-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p className="font-medium">© 2024 StoreAI. AI-Powered Grocery Management Platform.</p>
            <p className="font-mono text-xs">Optimizing Customer Lifetime Value through Operational Excellence</p>
          </div>
        </div>
      </footer>

      <AIChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}

export default App