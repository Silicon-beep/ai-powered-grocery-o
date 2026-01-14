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
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl font-display font-black tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
          Operations Overview
        </h1>
        <p className="text-muted-foreground text-base font-medium">
          Real-time insights across inventory, workforce, pricing, and customer lifetime value
        </p>
      </div>

      {(criticalItems.length > 0 || activeShrinkage.length > 0) && (
        <div className="space-y-4">
          {criticalItems.length > 0 && (
            <Alert className="border border-destructive/40 bg-gradient-to-r from-destructive/15 via-destructive/10 to-transparent shadow-lg shadow-destructive/10 backdrop-blur-sm">
              <WarningCircle className="h-5 w-5 text-destructive" weight="fill" />
              <AlertDescription className="text-sm font-semibold">
                <span className="font-black text-base">{criticalItems.length} CRITICAL STOCKOUT{criticalItems.length !== 1 ? 'S' : ''}</span>
                {' '}— Immediate action required to prevent lost sales.
              </AlertDescription>
            </Alert>
          )}
          
          {activeShrinkage.length > 0 && (
            <Alert className="border border-warning/40 bg-gradient-to-r from-warning/15 via-warning/10 to-transparent shadow-lg shadow-warning/10 backdrop-blur-sm">
              <ShieldWarning className="h-5 w-5 text-warning" weight="fill" />
              <AlertDescription className="text-sm font-semibold">
                <span className="font-black text-base">{activeShrinkage.length} SHRINKAGE EVENT{activeShrinkage.length !== 1 ? 'S' : ''}</span>
                {' '}under investigation. Total: ${activeShrinkage.reduce((sum, e) => sum + e.estimatedLoss, 0).toFixed(2)}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {metrics?.clv && <MetricCard metric={metrics.clv} />}
        {metrics?.revenue && <MetricCard metric={metrics.revenue} />}
        {metrics?.basketSize && <MetricCard metric={metrics.basketSize} />}
        {metrics?.churnRisk && <MetricCard metric={metrics.churnRisk} />}
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {metrics?.stockouts && <MetricCard metric={metrics.stockouts} />}
        {metrics?.waste && <MetricCard metric={metrics.waste} />}
        {metrics?.laborCost && <MetricCard metric={metrics.laborCost} />}
        {metrics?.margin && <MetricCard metric={metrics.margin} />}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-xl hover:shadow-primary/15 transition-all duration-300 border border-border/50 hover:border-accent/50 group backdrop-blur-xl bg-card/80">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 group-hover:from-secondary/30 group-hover:to-secondary/15 transition-all shadow-md shadow-secondary/15">
                <Package className="h-6 w-6 text-secondary" weight="duotone" />
              </div>
              <div>
                <CardTitle className="text-lg font-display font-bold">Inventory Status</CardTitle>
                <CardDescription className="text-xs font-medium">AI-powered stock mgmt</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-destructive/10 border border-destructive/25 backdrop-blur-sm shadow-sm shadow-destructive/10">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Critical</span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black font-mono text-destructive">{criticalItems.length}</span>
                <StatusBadge status="critical" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-warning/10 border border-warning/25 backdrop-blur-sm shadow-sm shadow-warning/10">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Low Stock</span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black font-mono text-warning">{lowItems.length}</span>
                <StatusBadge status="low" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-success/10 border border-success/25 backdrop-blur-sm shadow-sm shadow-success/10">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Optimal</span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black font-mono text-success">
                  {inventory?.filter(i => i.aiInsights.stockStatus === 'optimal').length || 0}
                </span>
                <StatusBadge status="optimal" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl hover:shadow-accent/15 transition-all duration-300 border border-border/50 hover:border-accent/50 group backdrop-blur-xl bg-card/80">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 group-hover:from-accent/30 group-hover:to-accent/15 transition-all shadow-md shadow-accent/15">
                <Users className="h-6 w-6 text-accent" weight="duotone" />
              </div>
              <div>
                <CardTitle className="text-lg font-display font-bold">Workforce</CardTitle>
                <CardDescription className="text-xs font-medium">Scheduling & optimization</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/60 border border-border backdrop-blur-sm shadow-sm">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Today's Shifts</span>
              <span className="text-2xl font-black font-mono text-foreground">24</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-warning/10 border border-warning/25 backdrop-blur-sm shadow-sm shadow-warning/10">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Coverage Gaps</span>
              <span className="text-2xl font-black font-mono text-warning">3</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-success/10 border border-success/25 backdrop-blur-sm shadow-sm shadow-success/10">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Optimal Hours</span>
              <span className="text-2xl font-black font-mono text-success">18</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl hover:shadow-primary/15 transition-all duration-300 border border-border/50 hover:border-primary/50 group backdrop-blur-xl bg-card/80">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/15 transition-all shadow-md shadow-primary/15">
                <Tag className="h-6 w-6 text-primary" weight="duotone" />
              </div>
              <div>
                <CardTitle className="text-lg font-display font-bold">Pricing</CardTitle>
                <CardDescription className="text-xs font-medium">Dynamic recommendations</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-accent/15 border border-accent/35 shadow-sm shadow-accent/15">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Pending</span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black font-mono text-accent">7</span>
                <Lightning className="h-5 w-5 text-accent" weight="fill" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-success/10 border border-success/25 shadow-sm shadow-success/10">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Revenue +</span>
              <span className="text-2xl font-black font-mono text-success">$2.3k</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-success/10 border border-success/25 shadow-sm shadow-success/10">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Waste −</span>
              <span className="text-2xl font-black font-mono text-success">18%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border shadow-lg shadow-primary/10 overflow-hidden backdrop-blur-xl bg-card/80">
        <CardHeader className="bg-gradient-to-r from-primary/15 via-accent/10 to-secondary/15 border-b border-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-accent to-primary shadow-lg shadow-primary/20">
              <ChartLine className="h-6 w-6 text-background" weight="bold" />
            </div>
            <div>
              <CardTitle className="text-xl font-display font-black">AI INSIGHTS SUMMARY</CardTitle>
              <CardDescription className="text-sm font-semibold">Key recommendations across all operational areas</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="p-5 rounded-xl bg-gradient-to-r from-accent/15 via-accent/10 to-accent/15 border border-accent/30 shadow-md shadow-accent/15">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-accent/25 shadow-md shadow-accent/15">
                <Lightning className="h-6 w-6 text-accent" weight="fill" />
              </div>
              <div className="flex-1">
                <p className="font-display font-black text-base mb-2 text-foreground uppercase tracking-wide">High Priority Actions</p>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  2 critical stockouts require immediate restocking. Fresh Bread and Organic Milk at risk of running out within 24 hours.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-5 rounded-xl bg-gradient-to-r from-success/15 via-success/10 to-success/15 border border-success/30 shadow-md shadow-success/15">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-success/25 shadow-md shadow-success/15">
                <ChartLine className="h-6 w-6 text-success" weight="bold" />
              </div>
              <div className="flex-1">
                <p className="font-display font-black text-base mb-2 text-foreground uppercase tracking-wide">CLV Optimization</p>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  Implementing all pending product placement recommendations could increase average basket size by 4.2% and improve CLV by $127 per customer.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-r from-warning/15 via-warning/10 to-warning/15 border border-warning/30 shadow-md shadow-warning/15">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-warning/25 shadow-md shadow-warning/15">
                <ShieldWarning className="h-6 w-6 text-warning" weight="bold" />
              </div>
              <div className="flex-1">
                <p className="font-display font-black text-base mb-2 text-foreground uppercase tracking-wide">Loss Prevention Alert</p>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
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
