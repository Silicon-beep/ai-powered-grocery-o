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
      
      <header className="border-b-2 border-primary/30 bg-card/80 backdrop-blur-2xl sticky top-0 z-50 shadow-2xl shadow-primary/10">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-5">
                <div className="relative p-4 rounded-3xl bg-gradient-to-br from-primary via-accent to-secondary shadow-2xl shadow-primary/30">
                  <Cpu size={40} className="text-background" weight="duotone" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-success rounded-full border-3 border-card animate-pulse shadow-lg shadow-success/50" />
                </div>
                <div>
                  <h1 className="text-4xl font-display font-black tracking-tight text-foreground">NeoContoso</h1>
                  <p className="text-sm text-muted-foreground font-semibold tracking-wider uppercase">Intelligent Retail Ops</p>
                </div>
              </div>
              <div className="h-14 w-0.5 bg-gradient-to-b from-transparent via-primary/40 to-transparent ml-2" />
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-base font-bold text-foreground">{store?.name || 'Loading...'}</p>
                  <p className="text-xs text-muted-foreground font-mono font-semibold">#{store?.storeNumber || '—'} • {store?.region || '—'}</p>
                </div>
                <Badge variant="outline" className="bg-success/20 text-success border-2 border-success/50 font-bold shadow-lg shadow-success/20 px-4 py-1.5">
                  <span className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse" />
                  ACTIVE
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="relative bg-gradient-to-r from-accent/25 to-primary/25 text-foreground border-2 border-accent/50 hover:from-accent/35 hover:to-primary/35 font-bold shadow-xl shadow-accent/20 transition-all hover:shadow-2xl hover:shadow-accent/30 hover:scale-105 px-6 py-6"
              >
                <Lightning size={22} weight="fill" className="mr-3 text-accent" />
                AI AGENTS ACTIVE
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-accent shadow-lg shadow-accent/50"></span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-8 py-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-10">
          <Card className="p-3 shadow-2xl border-2 border-border/60 bg-gradient-to-br from-card/95 via-card to-muted/30 backdrop-blur-xl">
            <TabsList className="w-full grid grid-cols-6 h-auto gap-3 bg-transparent p-2">
              <TabsTrigger 
                value="overview" 
                className="flex items-center gap-3 py-5 px-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-background data-[state=active]:shadow-2xl data-[state=active]:shadow-primary/30 font-bold transition-all hover:scale-105 rounded-2xl"
              >
                <ChartLine size={24} weight="duotone" />
                <span className="hidden md:inline text-base">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="inventory" 
                className="flex items-center gap-3 py-5 px-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-secondary data-[state=active]:to-primary data-[state=active]:text-background data-[state=active]:shadow-2xl data-[state=active]:shadow-secondary/30 font-bold transition-all hover:scale-105 rounded-2xl"
              >
                <Package size={24} weight="duotone" />
                <span className="hidden md:inline text-base">Inventory</span>
              </TabsTrigger>
              <TabsTrigger 
                value="workforce" 
                className="flex items-center gap-3 py-5 px-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-accent data-[state=active]:to-secondary data-[state=active]:text-background data-[state=active]:shadow-2xl data-[state=active]:shadow-accent/30 font-bold transition-all hover:scale-105 rounded-2xl"
              >
                <Users size={24} weight="duotone" />
                <span className="hidden md:inline text-base">Workforce</span>
              </TabsTrigger>
              <TabsTrigger 
                value="pricing" 
                className="flex items-center gap-3 py-5 px-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-background data-[state=active]:shadow-2xl data-[state=active]:shadow-primary/30 font-bold transition-all hover:scale-105 rounded-2xl"
              >
                <Tag size={24} weight="duotone" />
                <span className="hidden md:inline text-base">Pricing</span>
              </TabsTrigger>
              <TabsTrigger 
                value="loss" 
                className="flex items-center gap-3 py-5 px-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-destructive data-[state=active]:to-warning data-[state=active]:text-background data-[state=active]:shadow-2xl data-[state=active]:shadow-destructive/30 font-bold transition-all hover:scale-105 rounded-2xl"
              >
                <ShieldWarning size={24} weight="duotone" />
                <span className="hidden md:inline text-base">Loss Prevention</span>
              </TabsTrigger>
              <TabsTrigger 
                value="placement" 
                className="flex items-center gap-3 py-5 px-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-secondary data-[state=active]:to-accent data-[state=active]:text-background data-[state=active]:shadow-2xl data-[state=active]:shadow-secondary/30 font-bold transition-all hover:scale-105 rounded-2xl"
              >
                <Layout size={24} weight="duotone" />
                <span className="hidden md:inline text-base">Placement</span>
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

      <footer className="border-t-2 border-primary/30 mt-20 bg-gradient-to-r from-card/60 via-muted/40 to-card/60 backdrop-blur-xl">
        <div className="container mx-auto px-8 py-10">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p className="font-bold text-base">© 2024 NeoContoso. Intelligent Retail Operations Platform.</p>
            <p className="font-mono text-xs font-semibold tracking-wide">Optimizing CLV through AI-Driven Excellence</p>
          </div>
        </div>
      </footer>

      <AIChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}

export default App