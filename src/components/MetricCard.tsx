import { Card, CardContent } from '@/components/ui/card'
import { TrendUp, TrendDown, Minus } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { MetricCard as MetricCardType } from '@/lib/types'

interface MetricCardProps {
  metric: MetricCardType
  className?: string
}

export function MetricCard({ metric, className }: MetricCardProps) {
  const TrendIcon = metric.trend === 'up' ? TrendUp : 
                   metric.trend === 'down' ? TrendDown : 
                   Minus

  const trendColor = metric.status === 'success' ? 'text-success' :
                    metric.status === 'warning' ? 'text-warning' :
                    metric.status === 'critical' ? 'text-destructive' :
                    metric.trend === 'up' ? 'text-success' :
                    metric.trend === 'down' ? 'text-destructive' :
                    'text-muted-foreground'

  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">
            {metric.label}
          </p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold font-mono">
              {metric.value}
            </p>
            {metric.change !== undefined && (
              <div className={cn('flex items-center gap-1 text-sm font-medium', trendColor)}>
                <TrendIcon size={16} weight="bold" />
                <span>{Math.abs(metric.change)}%</span>
              </div>
            )}
          </div>
          {metric.changeLabel && (
            <p className="text-xs text-muted-foreground">
              {metric.changeLabel}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
