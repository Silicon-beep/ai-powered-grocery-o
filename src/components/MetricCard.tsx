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

  const statusBorder = metric.status === 'success' ? 'border-success/30 hover:border-success/60' :
                       metric.status === 'warning' ? 'border-warning/30 hover:border-warning/60' :
                       metric.status === 'critical' ? 'border-destructive/30 hover:border-destructive/60' :
                       'border-border/60 hover:border-accent/60'

  const statusGradient = metric.status === 'success' ? 'from-success/10 via-transparent to-transparent' :
                        metric.status === 'warning' ? 'from-warning/10 via-transparent to-transparent' :
                        metric.status === 'critical' ? 'from-destructive/10 via-transparent to-transparent' :
                        'from-primary/8 via-transparent to-transparent'

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className={cn(
        'hover:shadow-2xl transition-all duration-300 border-2 overflow-hidden backdrop-blur-xl',
        'bg-gradient-to-br from-card/95 to-muted/50',
        statusBorder,
        className
      )}>
        <div className={cn('absolute inset-0 bg-gradient-to-br opacity-100', statusGradient)} />
        <CardContent className="p-7 relative">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
              {metric.label}
            </p>
            <div className="flex items-baseline justify-between">
              <p className="text-5xl font-black font-mono tracking-tight text-foreground">
                {metric.value}
              </p>
              {metric.change !== undefined && (
                <motion.div 
                  className={cn(
                    'flex items-center gap-2 text-base font-black px-4 py-2 rounded-2xl', 
                    trendColor, 
                    'bg-background/90 backdrop-blur-sm border-2 border-current/30 shadow-lg'
                  )}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.3, ease: "backOut" }}
                >
                  <TrendIcon size={18} weight="bold" />
                  <span>{Math.abs(metric.change)}%</span>
                </motion.div>
              )}
            </div>
            {metric.changeLabel && (
              <p className="text-sm text-muted-foreground font-semibold mt-1">
                {metric.changeLabel}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
