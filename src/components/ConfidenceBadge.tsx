import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ConfidenceBadgeProps {
  confidence: number
  className?: string
}

export function ConfidenceBadge({ confidence, className }: ConfidenceBadgeProps) {
  const level = confidence >= 0.85 ? 'high' : confidence >= 0.70 ? 'medium' : 'low'
  
  const variant = level === 'high' ? 'default' : level === 'medium' ? 'secondary' : 'outline'
  
  const colorClass = level === 'high' ? 'bg-accent text-accent-foreground border-accent' :
                    level === 'medium' ? 'bg-warning/10 text-warning-foreground border-warning' :
                    'bg-muted text-muted-foreground border-border'

  return (
    <Badge 
      variant={variant} 
      className={cn(
        'font-medium',
        colorClass,
        className
      )}
    >
      {(confidence * 100).toFixed(0)}% Confidence
    </Badge>
  )
}
