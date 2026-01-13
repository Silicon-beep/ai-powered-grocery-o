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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Operations Overview</h1>
        <p className="text-muted-foreground mt-1">
          Real-time insights across inventory, workforce, pricing, and customer lifetime value
        </p>
      </div>

      {(criticalItems.length > 0 || activeShrinkage.length > 0) && (
        <div className="space-y-3">
          {criticalItems.length > 0 && (
            <Alert className="border-destructive/50 bg-destructive/5">
              <WarningCircle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-sm">
                <span className="font-semibold">{criticalItems.length} critical stockout{criticalItems.length !== 1 ? 's' : ''}</span>
                {' '}detected. Immediate action required to prevent lost sales.
              </AlertDescription>
            </Alert>
          )}
          
          {activeShrinkage.length > 0 && (
            <Alert className="border-warning/50 bg-warning/5">
              <ShieldWarning className="h-4 w-4 text-warning-foreground" />
              <AlertDescription className="text-sm">
                <span className="font-semibold">{activeShrinkage.length} shrinkage event{activeShrinkage.length !== 1 ? 's' : ''}</span>
                {' '}under investigation. Total estimated loss: ${activeShrinkage.reduce((sum, e) => sum + e.estimatedLoss, 0).toFixed(2)}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics?.clv && <MetricCard metric={metrics.clv} />}
        {metrics?.revenue && <MetricCard metric={metrics.revenue} />}
        {metrics?.basketSize && <MetricCard metric={metrics.basketSize} />}
        {metrics?.churnRisk && <MetricCard metric={metrics.churnRisk} />}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics?.stockouts && <MetricCard metric={metrics.stockouts} />}
        {metrics?.waste && <MetricCard metric={metrics.waste} />}
        {metrics?.laborCost && <MetricCard metric={metrics.laborCost} />}
        {metrics?.margin && <MetricCard metric={metrics.margin} />}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Package className="h-5 w-5 text-accent-foreground" weight="bold" />
              </div>
              <div>
                <CardTitle className="text-base">Inventory Status</CardTitle>
                <CardDescription className="text-xs">AI-powered stock management</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Critical</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold font-mono text-destructive">{criticalItems.length}</span>
                <StatusBadge status="critical" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Low Stock</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold font-mono text-warning-foreground">{lowItems.length}</span>
                <StatusBadge status="low" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Optimal</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold font-mono text-success">
                  {inventory?.filter(i => i.aiInsights.stockStatus === 'optimal').length || 0}
                </span>
                <StatusBadge status="optimal" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Users className="h-5 w-5 text-accent-foreground" weight="bold" />
              </div>
              <div>
                <CardTitle className="text-base">Workforce</CardTitle>
                <CardDescription className="text-xs">Scheduling & optimization</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Today's Shifts</span>
              <span className="text-lg font-bold font-mono">24</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Coverage Gaps</span>
              <span className="text-lg font-bold font-mono text-warning-foreground">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Optimal Hours</span>
              <span className="text-lg font-bold font-mono text-success">18</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Tag className="h-5 w-5 text-accent-foreground" weight="bold" />
              </div>
              <div>
                <CardTitle className="text-base">Pricing</CardTitle>
                <CardDescription className="text-xs">Dynamic recommendations</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pending Actions</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold font-mono text-accent-foreground">7</span>
                <Lightning className="h-4 w-4 text-accent-foreground" weight="fill" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Est. Revenue Impact</span>
              <span className="text-lg font-bold font-mono text-success">+$2,340</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Waste Reduction</span>
              <span className="text-lg font-bold font-mono text-success">-18%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <ChartLine className="h-5 w-5 text-accent-foreground" weight="bold" />
            </div>
            <div>
              <CardTitle>AI Insights Summary</CardTitle>
              <CardDescription>Key recommendations across all operational areas</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
            <div className="flex items-start gap-3">
              <Lightning className="h-5 w-5 text-accent-foreground mt-0.5" weight="fill" />
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">High Priority Actions</p>
                <p className="text-sm text-muted-foreground">
                  2 critical stockouts require immediate restocking. Fresh Bread and Organic Milk at risk of running out within 24 hours.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-success/5 border border-success/20">
            <div className="flex items-start gap-3">
              <ChartLine className="h-5 w-5 text-success mt-0.5" weight="bold" />
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">CLV Optimization Opportunity</p>
                <p className="text-sm text-muted-foreground">
                  Implementing all pending product placement recommendations could increase average basket size by 4.2% and improve CLV by $127 per customer.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
            <div className="flex items-start gap-3">
              <ShieldWarning className="h-5 w-5 text-warning-foreground mt-0.5" weight="bold" />
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">Loss Prevention Alert</p>
                <p className="text-sm text-muted-foreground">
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
