import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MetricCard } from '@/components/MetricCard'
import { StatusBadge } from '@/components/StatusBadge'
import { 
  ChartLine, 
  Package, 
  Users, 
  Tag, 
  ShieldWarning,
  Lightning,
  WarningCircle 
} from '@phosphor-icons/react'
import { inventoryApi, lossPreventionApi, metricsApi } from '@/lib/api-service'
import { useApiData } from '@/hooks/use-api-data'

export function OperationsOverview() {
  const { data: inventory } = useApiData(inventoryApi.getAll)
  const { data: shrinkageEvents } = useApiData(lossPreventionApi.getShrinkageEvents)
  const { data: metrics } = useApiData(metricsApi.getOperational)

  const criticalItems = inventory?.filter(item => item.aiInsights.stockStatus === 'critical') || []
  const lowItems = inventory?.filter(item => item.aiInsights.stockStatus === 'low') || []
  const activeShrinkage = shrinkageEvents?.filter(e => e.status === 'investigating') || []

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-6xl font-display font-black tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-3">
          Operations Overview
        </h1>
        <p className="text-muted-foreground text-lg font-semibold">
          Real-time insights across inventory, workforce, pricing, and customer lifetime value
        </p>
      </div>

      {(criticalItems.length > 0 || activeShrinkage.length > 0) && (
        <div className="space-y-5">
          {criticalItems.length > 0 && (
            <Alert className="border-2 border-destructive/50 bg-gradient-to-r from-destructive/20 via-destructive/10 to-transparent shadow-2xl shadow-destructive/20 backdrop-blur-sm">
              <WarningCircle className="h-6 w-6 text-destructive" weight="fill" />
              <AlertDescription className="text-base font-bold">
                <span className="font-black text-lg">{criticalItems.length} CRITICAL STOCKOUT{criticalItems.length !== 1 ? 'S' : ''}</span>
                {' '}— Immediate action required to prevent lost sales.
              </AlertDescription>
            </Alert>
          )}
          
          {activeShrinkage.length > 0 && (
            <Alert className="border-2 border-warning/50 bg-gradient-to-r from-warning/20 via-warning/10 to-transparent shadow-2xl shadow-warning/20 backdrop-blur-sm">
              <ShieldWarning className="h-6 w-6 text-warning" weight="fill" />
              <AlertDescription className="text-base font-bold">
                <span className="font-black text-lg">{activeShrinkage.length} SHRINKAGE EVENT{activeShrinkage.length !== 1 ? 'S' : ''}</span>
                {' '}under investigation. Total: ${activeShrinkage.reduce((sum, e) => sum + e.estimatedLoss, 0).toFixed(2)}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics?.clv && <MetricCard metric={metrics.clv} />}
        {metrics?.revenue && <MetricCard metric={metrics.revenue} />}
        {metrics?.basketSize && <MetricCard metric={metrics.basketSize} />}
        {metrics?.churnRisk && <MetricCard metric={metrics.churnRisk} />}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics?.stockouts && <MetricCard metric={metrics.stockouts} />}
        {metrics?.waste && <MetricCard metric={metrics.waste} />}
        {metrics?.laborCost && <MetricCard metric={metrics.laborCost} />}
        {metrics?.margin && <MetricCard metric={metrics.margin} />}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 border-2 border-border/60 hover:border-accent/60 group backdrop-blur-xl bg-gradient-to-br from-card/95 to-muted/50">
          <CardHeader className="pb-5">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-secondary/25 to-secondary/10 group-hover:from-secondary/35 group-hover:to-secondary/15 transition-all shadow-lg shadow-secondary/20">
                <Package className="h-7 w-7 text-secondary" weight="duotone" />
              </div>
              <div>
                <CardTitle className="text-xl font-display font-bold">Inventory Status</CardTitle>
                <CardDescription className="text-sm font-semibold">AI-powered stock mgmt</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-destructive/15 border-2 border-destructive/30 backdrop-blur-sm shadow-lg shadow-destructive/10">
              <span className="text-base font-bold text-muted-foreground uppercase tracking-wide">Critical</span>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-black font-mono text-destructive">{criticalItems.length}</span>
                <StatusBadge status="critical" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-warning/15 border-2 border-warning/30 backdrop-blur-sm shadow-lg shadow-warning/10">
              <span className="text-base font-bold text-muted-foreground uppercase tracking-wide">Low Stock</span>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-black font-mono text-warning">{lowItems.length}</span>
                <StatusBadge status="low" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-success/15 border-2 border-success/30 backdrop-blur-sm shadow-lg shadow-success/10">
              <span className="text-base font-bold text-muted-foreground uppercase tracking-wide">Optimal</span>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-black font-mono text-success">
                  {inventory?.filter(i => i.aiInsights.stockStatus === 'optimal').length || 0}
                </span>
                <StatusBadge status="optimal" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 border-2 border-border/60 hover:border-accent/60 group backdrop-blur-xl bg-gradient-to-br from-card/95 to-muted/50">
          <CardHeader className="pb-5">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-accent/25 to-accent/10 group-hover:from-accent/35 group-hover:to-accent/15 transition-all shadow-lg shadow-accent/20">
                <Users className="h-7 w-7 text-accent" weight="duotone" />
              </div>
              <div>
                <CardTitle className="text-xl font-display font-bold">Workforce</CardTitle>
                <CardDescription className="text-sm font-semibold">Scheduling & optimization</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/60 border-2 border-border backdrop-blur-sm shadow-lg">
              <span className="text-base font-bold text-muted-foreground uppercase tracking-wide">Today's Shifts</span>
              <span className="text-3xl font-black font-mono text-foreground">24</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-warning/15 border-2 border-warning/30 backdrop-blur-sm shadow-lg shadow-warning/10">
              <span className="text-base font-bold text-muted-foreground uppercase tracking-wide">Coverage Gaps</span>
              <span className="text-3xl font-black font-mono text-warning">3</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-success/15 border-2 border-success/30 backdrop-blur-sm shadow-lg shadow-success/10">
              <span className="text-base font-bold text-muted-foreground uppercase tracking-wide">Optimal Hours</span>
              <span className="text-3xl font-black font-mono text-success">18</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 border-2 border-border/60 hover:border-primary/60 group backdrop-blur-xl bg-gradient-to-br from-card/95 to-muted/50">
          <CardHeader className="pb-5">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/25 to-primary/10 group-hover:from-primary/35 group-hover:to-primary/15 transition-all shadow-lg shadow-primary/20">
                <Tag className="h-7 w-7 text-primary" weight="duotone" />
              </div>
              <div>
                <CardTitle className="text-xl font-display font-bold">Pricing</CardTitle>
                <CardDescription className="text-sm font-semibold">Dynamic recommendations</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-accent/20 border-2 border-accent/40 shadow-lg shadow-accent/20">
              <span className="text-base font-bold text-muted-foreground uppercase tracking-wide">Pending</span>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-black font-mono text-accent">7</span>
                <Lightning className="h-6 w-6 text-accent" weight="fill" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-success/15 border-2 border-success/30 shadow-lg shadow-success/10">
              <span className="text-base font-bold text-muted-foreground uppercase tracking-wide">Revenue +</span>
              <span className="text-3xl font-black font-mono text-success">$2.3k</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-success/15 border-2 border-success/30 shadow-lg shadow-success/10">
              <span className="text-base font-bold text-muted-foreground uppercase tracking-wide">Waste −</span>
              <span className="text-3xl font-black font-mono text-success">18%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 shadow-2xl shadow-primary/10 overflow-hidden backdrop-blur-xl bg-gradient-to-br from-card/95 to-muted/50">
        <CardHeader className="bg-gradient-to-r from-primary/20 via-accent/15 to-secondary/20 border-b-2 border-primary/30">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-accent to-primary shadow-2xl shadow-primary/30">
              <ChartLine className="h-8 w-8 text-background" weight="bold" />
            </div>
            <div>
              <CardTitle className="text-2xl font-display font-black">AI INSIGHTS SUMMARY</CardTitle>
              <CardDescription className="text-base font-bold">Key recommendations across all operational areas</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pt-8">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 border-2 border-accent/40 shadow-xl shadow-accent/20">
            <div className="flex items-start gap-5">
              <div className="p-3 rounded-xl bg-accent/30 shadow-lg shadow-accent/20">
                <Lightning className="h-7 w-7 text-accent" weight="fill" />
              </div>
              <div className="flex-1">
                <p className="font-display font-black text-lg mb-3 text-foreground uppercase tracking-wide">High Priority Actions</p>
                <p className="text-base text-muted-foreground font-semibold leading-relaxed">
                  2 critical stockouts require immediate restocking. Fresh Bread and Organic Milk at risk of running out within 24 hours.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl bg-gradient-to-r from-success/20 via-success/10 to-success/20 border-2 border-success/40 shadow-xl shadow-success/20">
            <div className="flex items-start gap-5">
              <div className="p-3 rounded-xl bg-success/30 shadow-lg shadow-success/20">
                <ChartLine className="h-7 w-7 text-success" weight="bold" />
              </div>
              <div className="flex-1">
                <p className="font-display font-black text-lg mb-3 text-foreground uppercase tracking-wide">CLV Optimization</p>
                <p className="text-base text-muted-foreground font-semibold leading-relaxed">
                  Implementing all pending product placement recommendations could increase average basket size by 4.2% and improve CLV by $127 per customer.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-warning/20 via-warning/10 to-warning/20 border-2 border-warning/40 shadow-xl shadow-warning/20">
            <div className="flex items-start gap-5">
              <div className="p-3 rounded-xl bg-warning/30 shadow-lg shadow-warning/20">
                <ShieldWarning className="h-7 w-7 text-warning" weight="bold" />
              </div>
              <div className="flex-1">
                <p className="font-display font-black text-lg mb-3 text-foreground uppercase tracking-wide">Loss Prevention Alert</p>
                <p className="text-base text-muted-foreground font-semibold leading-relaxed">
                  Unusual shrinkage pattern detected in Premium Steaks category. Recommend immediate investigation and inventory audit.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
