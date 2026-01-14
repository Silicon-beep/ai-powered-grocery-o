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
  Lightning,
  Cpu
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
      
      <header className="border-b border-border/60 bg-card/95 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="relative p-3 rounded-2xl bg-gradient-to-br from-primary via-primary to-accent shadow-lg">
                  <Cpu size={32} className="text-primary-foreground" weight="duotone" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-card animate-pulse" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">NeoContoso</h1>
                  <p className="text-xs text-muted-foreground font-medium tracking-wide">Intelligent Retail Operations</p>
                </div>
              </div>
              <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent ml-2" />
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{store?.name || 'Loading...'}</p>
                  <p className="text-xs text-muted-foreground font-mono">#{store?.storeNumber || '—'} • {store?.region || '—'}</p>
                </div>
                <Badge variant="outline" className="bg-success/10 text-success border-success/30 font-semibold shadow-sm px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success mr-2 animate-pulse" />
                  Active
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="relative bg-gradient-to-r from-accent/15 to-primary/15 text-accent-foreground border border-accent/30 hover:from-accent/25 hover:to-primary/25 font-semibold shadow-md transition-all hover:shadow-lg hover:scale-[1.02] px-5"
              >
                <Lightning size={18} weight="duotone" className="mr-2 text-accent" />
                AI Agents Active
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <Card className="p-2 shadow-xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/20 backdrop-blur">
            <TabsList className="w-full grid grid-cols-6 h-auto gap-2 bg-transparent p-1.5">
              <TabsTrigger 
                value="overview" 
                className="flex items-center gap-2.5 py-4 px-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg font-semibold transition-all hover:scale-[1.02] rounded-lg"
              >
                <ChartLine size={22} weight="duotone" />
                <span className="hidden md:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="inventory" 
                className="flex items-center gap-2.5 py-4 px-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg font-semibold transition-all hover:scale-[1.02] rounded-lg"
              >
                <Package size={22} weight="duotone" />
                <span className="hidden md:inline">Inventory</span>
              </TabsTrigger>
              <TabsTrigger 
                value="workforce" 
                className="flex items-center gap-2.5 py-4 px-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg font-semibold transition-all hover:scale-[1.02] rounded-lg"
              >
                <Users size={22} weight="duotone" />
                <span className="hidden md:inline">Workforce</span>
              </TabsTrigger>
              <TabsTrigger 
                value="pricing" 
                className="flex items-center gap-2.5 py-4 px-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg font-semibold transition-all hover:scale-[1.02] rounded-lg"
              >
                <Tag size={22} weight="duotone" />
                <span className="hidden md:inline">Pricing</span>
              </TabsTrigger>
              <TabsTrigger 
                value="loss" 
                className="flex items-center gap-2.5 py-4 px-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg font-semibold transition-all hover:scale-[1.02] rounded-lg"
              >
                <ShieldWarning size={22} weight="duotone" />
                <span className="hidden md:inline">Loss Prevention</span>
              </TabsTrigger>
              <TabsTrigger 
                value="placement" 
                className="flex items-center gap-2.5 py-4 px-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg font-semibold transition-all hover:scale-[1.02] rounded-lg"
              >
                <Layout size={22} weight="duotone" />
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

      <footer className="border-t border-border/60 mt-16 bg-gradient-to-r from-card/50 via-muted/30 to-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-8 py-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p className="font-medium">© 2024 NeoContoso. Intelligent Retail Operations Platform.</p>
            <p className="font-mono text-xs">Optimizing Customer Lifetime Value through AI-Driven Excellence</p>
          </div>
        </div>
      </footer>

      <AIChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}

export default App