import { Card, CardContent } from '@/components/ui/card'
import { TrendUp, TrendDown, Minus } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { MetricCard as MetricCardType } from '@/lib/types'
import { motion } from 'framer-motion'

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

  const statusGradient = metric.status === 'success' ? 'from-success/10 to-success/5' :
                        metric.status === 'warning' ? 'from-warning/10 to-warning/5' :
                        metric.status === 'critical' ? 'from-destructive/10 to-destructive/5' :
                        'from-primary/5 to-transparent'

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        'hover:shadow-xl transition-all duration-300 border-2 overflow-hidden',
        'bg-gradient-to-br',
        statusGradient,
        className
      )}>
        <CardContent className="p-6">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              {metric.label}
            </p>
            <div className="flex items-baseline justify-between">
              <p className="text-4xl font-black font-mono tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                {metric.value}
              </p>
              {metric.change !== undefined && (
                <motion.div 
                  className={cn('flex items-center gap-1.5 text-base font-bold px-3 py-1.5 rounded-full', trendColor, 'bg-background/50')}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <TrendIcon size={18} weight="bold" />
                  <span>{Math.abs(metric.change)}%</span>
                </motion.div>
              )}
            </div>
            {metric.changeLabel && (
              <p className="text-xs text-muted-foreground font-medium mt-1">
                {metric.changeLabel}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
