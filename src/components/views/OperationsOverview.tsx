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
        <h1 className="text-4xl font-black tracking-tight font-heading bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Operations Overview
        </h1>
        <p className="text-muted-foreground mt-2 text-base font-medium">
          Real-time insights across inventory, workforce, pricing, and customer lifetime value
        </p>
      </div>

      {(criticalItems.length > 0 || activeShrinkage.length > 0) && (
        <div className="space-y-4">
          {criticalItems.length > 0 && (
            <Alert className="border-2 border-destructive/50 bg-gradient-to-r from-destructive/10 via-destructive/5 to-destructive/10 shadow-lg">
              <WarningCircle className="h-5 w-5 text-destructive" weight="fill" />
              <AlertDescription className="text-sm font-medium">
                <span className="font-black">{criticalItems.length} critical stockout{criticalItems.length !== 1 ? 's' : ''}</span>
                {' '}detected. Immediate action required to prevent lost sales.
              </AlertDescription>
            </Alert>
          )}
          
          {activeShrinkage.length > 0 && (
            <Alert className="border-2 border-warning/50 bg-gradient-to-r from-warning/10 via-warning/5 to-warning/10 shadow-lg">
              <ShieldWarning className="h-5 w-5 text-warning-foreground" weight="fill" />
              <AlertDescription className="text-sm font-medium">
                <span className="font-black">{activeShrinkage.length} shrinkage event{activeShrinkage.length !== 1 ? 's' : ''}</span>
                {' '}under investigation. Total estimated loss: ${activeShrinkage.reduce((sum, e) => sum + e.estimatedLoss, 0).toFixed(2)}
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-accent/50 group">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 group-hover:from-accent/30 group-hover:to-accent/20 transition-all shadow-sm">
                <Package className="h-6 w-6 text-accent" weight="bold" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold font-heading">Inventory Status</CardTitle>
                <CardDescription className="text-xs font-medium">AI-powered stock management</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20">
              <span className="text-sm font-bold text-muted-foreground">Critical</span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black font-mono text-destructive">{criticalItems.length}</span>
                <StatusBadge status="critical" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/20">
              <span className="text-sm font-bold text-muted-foreground">Low Stock</span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black font-mono text-warning-foreground">{lowItems.length}</span>
                <StatusBadge status="low" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-success/5 border border-success/20">
              <span className="text-sm font-bold text-muted-foreground">Optimal</span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black font-mono text-success">
                  {inventory?.filter(i => i.aiInsights.stockStatus === 'optimal').length || 0}
                </span>
                <StatusBadge status="optimal" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-accent/50 group">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all shadow-sm">
                <Users className="h-6 w-6 text-primary" weight="bold" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold font-heading">Workforce</CardTitle>
                <CardDescription className="text-xs font-medium">Scheduling & optimization</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
              <span className="text-sm font-bold text-muted-foreground">Today's Shifts</span>
              <span className="text-2xl font-black font-mono">24</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/20">
              <span className="text-sm font-bold text-muted-foreground">Coverage Gaps</span>
              <span className="text-2xl font-black font-mono text-warning-foreground">3</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-success/5 border border-success/20">
              <span className="text-sm font-bold text-muted-foreground">Optimal Hours</span>
              <span className="text-2xl font-black font-mono text-success">18</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-accent/50 group">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 group-hover:from-secondary/30 group-hover:to-secondary/20 transition-all shadow-sm">
                <Tag className="h-6 w-6 text-secondary" weight="bold" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold font-heading">Pricing</CardTitle>
                <CardDescription className="text-xs font-medium">Dynamic recommendations</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10 border border-accent/30">
              <span className="text-sm font-bold text-muted-foreground">Pending Actions</span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black font-mono text-accent">7</span>
                <Lightning className="h-5 w-5 text-accent" weight="fill" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-success/5 border border-success/20">
              <span className="text-sm font-bold text-muted-foreground">Est. Revenue Impact</span>
              <span className="text-2xl font-black font-mono text-success">+$2,340</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-success/5 border border-success/20">
              <span className="text-sm font-bold text-muted-foreground">Waste Reduction</span>
              <span className="text-2xl font-black font-mono text-success">-18%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-accent/10 via-primary/5 to-accent/10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-accent to-primary shadow-md">
              <ChartLine className="h-6 w-6 text-primary-foreground" weight="bold" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold font-heading">AI Insights Summary</CardTitle>
              <CardDescription className="text-sm font-medium">Key recommendations across all operational areas</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="p-5 rounded-xl bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 border-2 border-accent/30 shadow-md">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-accent/20 shadow-sm">
                <Lightning className="h-6 w-6 text-accent" weight="fill" />
              </div>
              <div className="flex-1">
                <p className="font-black text-base mb-2 font-heading">High Priority Actions</p>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  2 critical stockouts require immediate restocking. Fresh Bread and Organic Milk at risk of running out within 24 hours.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-5 rounded-xl bg-gradient-to-r from-success/10 via-success/5 to-success/10 border-2 border-success/30 shadow-md">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-success/20 shadow-sm">
                <ChartLine className="h-6 w-6 text-success" weight="bold" />
              </div>
              <div className="flex-1">
                <p className="font-black text-base mb-2 font-heading">CLV Optimization Opportunity</p>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  Implementing all pending product placement recommendations could increase average basket size by 4.2% and improve CLV by $127 per customer.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-r from-warning/10 via-warning/5 to-warning/10 border-2 border-warning/30 shadow-md">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-warning/20 shadow-sm">
                <ShieldWarning className="h-6 w-6 text-warning-foreground" weight="bold" />
              </div>
              <div className="flex-1">
                <p className="font-black text-base mb-2 font-heading">Loss Prevention Alert</p>
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
