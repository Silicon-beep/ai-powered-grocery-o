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
      
      <header className="border-b border-primary/20 bg-card/60 backdrop-blur-3xl sticky top-0 z-50 shadow-lg shadow-primary/5">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4">
                <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary shadow-lg shadow-primary/20">
                  <Cpu size={32} className="text-background" weight="duotone" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-card animate-pulse shadow-md shadow-success/40" />
                </div>
                <div>
                  <h1 className="text-3xl font-display font-black tracking-tight text-foreground">NeoContoso</h1>
                  <p className="text-xs text-muted-foreground font-semibold tracking-wide uppercase">Intelligent Retail Ops</p>
                </div>
              </div>
              <div className="h-10 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
              <div className="flex items-center gap-3.5">
                <div>
                  <p className="text-sm font-bold text-foreground">{store?.name || 'Loading...'}</p>
                  <p className="text-xs text-muted-foreground font-mono">#{store?.storeNumber || '—'} • {store?.region || '—'}</p>
                </div>
                <Badge variant="outline" className="bg-success/15 text-success border border-success/40 font-semibold shadow-sm shadow-success/10 px-3 py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-success mr-1.5 animate-pulse" />
                  ACTIVE
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="relative bg-gradient-to-r from-accent/20 to-primary/20 text-foreground border border-accent/40 hover:from-accent/30 hover:to-primary/30 hover:border-accent/60 font-bold shadow-md shadow-accent/15 transition-all hover:shadow-lg hover:shadow-accent/20 hover:scale-[1.02] px-5 py-5"
              >
                <Lightning size={20} weight="fill" className="mr-2.5 text-accent" />
                AI AGENTS ACTIVE
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent shadow-md shadow-accent/40"></span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <Card className="p-2 shadow-lg border border-border/50 bg-card/80 backdrop-blur-xl">
            <TabsList className="w-full grid grid-cols-6 h-auto gap-2 bg-transparent p-1.5">
              <TabsTrigger 
                value="overview" 
                className="flex items-center gap-2.5 py-3.5 px-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-background data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 font-bold transition-all hover:scale-[1.02] rounded-xl"
              >
                <ChartLine size={20} weight="duotone" />
                <span className="hidden md:inline text-sm">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="inventory" 
                className="flex items-center gap-2.5 py-3.5 px-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-secondary data-[state=active]:to-primary data-[state=active]:text-background data-[state=active]:shadow-lg data-[state=active]:shadow-secondary/20 font-bold transition-all hover:scale-[1.02] rounded-xl"
              >
                <Package size={20} weight="duotone" />
                <span className="hidden md:inline text-sm">Inventory</span>
              </TabsTrigger>
              <TabsTrigger 
                value="workforce" 
                className="flex items-center gap-2.5 py-3.5 px-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-accent data-[state=active]:to-secondary data-[state=active]:text-background data-[state=active]:shadow-lg data-[state=active]:shadow-accent/20 font-bold transition-all hover:scale-[1.02] rounded-xl"
              >
                <Users size={20} weight="duotone" />
                <span className="hidden md:inline text-sm">Workforce</span>
              </TabsTrigger>
              <TabsTrigger 
                value="pricing" 
                className="flex items-center gap-2.5 py-3.5 px-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-background data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 font-bold transition-all hover:scale-[1.02] rounded-xl"
              >
                <Tag size={20} weight="duotone" />
                <span className="hidden md:inline text-sm">Pricing</span>
              </TabsTrigger>
              <TabsTrigger 
                value="loss" 
                className="flex items-center gap-2.5 py-3.5 px-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-destructive data-[state=active]:to-warning data-[state=active]:text-background data-[state=active]:shadow-lg data-[state=active]:shadow-destructive/20 font-bold transition-all hover:scale-[1.02] rounded-xl"
              >
                <ShieldWarning size={20} weight="duotone" />
                <span className="hidden md:inline text-sm">Loss Prevention</span>
              </TabsTrigger>
              <TabsTrigger 
                value="placement" 
                className="flex items-center gap-2.5 py-3.5 px-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-secondary data-[state=active]:to-accent data-[state=active]:text-background data-[state=active]:shadow-lg data-[state=active]:shadow-secondary/20 font-bold transition-all hover:scale-[1.02] rounded-xl"
              >
                <Layout size={20} weight="duotone" />
                <span className="hidden md:inline text-sm">Placement</span>
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

      <footer className="border-t border-primary/20 mt-16 bg-card/40 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p className="font-semibold text-sm">© 2024 NeoContoso. Intelligent Retail Operations Platform.</p>
            <p className="font-mono text-xs">Optimizing CLV through AI-Driven Excellence</p>
          </div>
        </div>
      </footer>

      <AIChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}

export default App