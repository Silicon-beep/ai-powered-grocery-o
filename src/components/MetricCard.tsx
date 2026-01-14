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

  const statusBorder = metric.status === 'success' ? 'border-success/20 hover:border-success/40' :
                       metric.status === 'warning' ? 'border-warning/20 hover:border-warning/40' :
                       metric.status === 'critical' ? 'border-destructive/20 hover:border-destructive/40' :
                       'border-border/50 hover:border-accent/40'

  const statusGradient = metric.status === 'success' ? 'from-success/5 via-transparent to-transparent' :
                        metric.status === 'warning' ? 'from-warning/5 via-transparent to-transparent' :
                        metric.status === 'critical' ? 'from-destructive/5 via-transparent to-transparent' :
                        'from-primary/3 via-transparent to-transparent'

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className={cn(
        'hover:shadow-xl transition-all duration-300 border overflow-hidden backdrop-blur-sm',
        'bg-gradient-to-br from-card to-card/95',
        statusBorder,
        className
      )}>
        <div className={cn('absolute inset-0 bg-gradient-to-br opacity-100', statusGradient)} />
        <CardContent className="p-6 relative">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {metric.label}
            </p>
            <div className="flex items-baseline justify-between">
              <p className="text-4xl font-bold font-mono tracking-tight text-foreground">
                {metric.value}
              </p>
              {metric.change !== undefined && (
                <motion.div 
                  className={cn(
                    'flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full', 
                    trendColor, 
                    'bg-background/80 backdrop-blur-sm border border-current/20'
                  )}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.3, ease: "backOut" }}
                >
                  <TrendIcon size={16} weight="bold" />
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
