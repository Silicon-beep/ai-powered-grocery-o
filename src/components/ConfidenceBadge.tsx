import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ConfidenceBadgeProps {
  confidence: number
  className?: string
}

export function ConfidenceBadge({ confidence, className }: ConfidenceBadgeProps) {
  const level = confidence >= 0.85 ? 'high' : confidence >= 0.70 ? 'medium' : 'low'
  
  const colorClass = level === 'high' ? 'bg-accent/20 text-accent border-accent shadow-sm shadow-accent/20' :
                    level === 'medium' ? 'bg-warning/20 text-warning-foreground border-warning shadow-sm shadow-warning/20' :
                    'bg-muted text-muted-foreground border-border'

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'font-bold text-xs border-2 font-mono',
        colorClass,
        className
      )}
    >
      {(confidence * 100).toFixed(0)}% Confidence
    </Badge>
  )
}
