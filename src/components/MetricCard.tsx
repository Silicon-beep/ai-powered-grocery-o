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

  const statusBorder = metric.status === 'success' ? 'border-success/25 hover:border-success/50' :
                       metric.status === 'warning' ? 'border-warning/25 hover:border-warning/50' :
                       metric.status === 'critical' ? 'border-destructive/25 hover:border-destructive/50' :
                       'border-border/50 hover:border-accent/50'

  const statusGradient = metric.status === 'success' ? 'from-success/8 via-transparent to-transparent' :
                        metric.status === 'warning' ? 'from-warning/8 via-transparent to-transparent' :
                        metric.status === 'critical' ? 'from-destructive/8 via-transparent to-transparent' :
                        'from-primary/6 via-transparent to-transparent'

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className={cn(
        'hover:shadow-xl transition-all duration-300 border overflow-hidden backdrop-blur-xl',
        'bg-card/80',
        statusBorder,
        className
      )}>
        <div className={cn('absolute inset-0 bg-gradient-to-br opacity-100', statusGradient)} />
        <CardContent className="p-5 relative">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {metric.label}
            </p>
            <div className="flex items-baseline justify-between">
              <p className="text-4xl font-black font-mono tracking-tight text-foreground">
                {metric.value}
              </p>
              {metric.change !== undefined && (
                <motion.div 
                  className={cn(
                    'flex items-center gap-1.5 text-sm font-black px-3 py-1.5 rounded-xl', 
                    trendColor, 
                    'bg-background/80 backdrop-blur-sm border border-current/25 shadow-md'
                  )}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.25, ease: "backOut" }}
                >
                  <TrendIcon size={16} weight="bold" />
                  <span>{Math.abs(metric.change)}%</span>
                </motion.div>
              )}
            </div>
            {metric.changeLabel && (
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                {metric.changeLabel}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
