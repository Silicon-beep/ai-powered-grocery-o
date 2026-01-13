import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'optimal' | 'low' | 'critical' | 'overstock' | 'adequate' | 'understaffed' | 'overstaffed' | 'high' | 'medium' | 'low' | 'investigating' | 'resolved' | 'false_positive'
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = {
    optimal: { label: 'Optimal', color: 'bg-success/10 text-success border-success' },
    low: { label: 'Low', color: 'bg-warning/10 text-warning-foreground border-warning' },
    critical: { label: 'Critical', color: 'bg-destructive/10 text-destructive border-destructive' },
    overstock: { label: 'Overstock', color: 'bg-warning/10 text-warning-foreground border-warning' },
    adequate: { label: 'Adequate', color: 'bg-success/10 text-success border-success' },
    understaffed: { label: 'Understaffed', color: 'bg-destructive/10 text-destructive border-destructive' },
    overstaffed: { label: 'Overstaffed', color: 'bg-warning/10 text-warning-foreground border-warning' },
    high: { label: 'High', color: 'bg-destructive/10 text-destructive border-destructive' },
    medium: { label: 'Medium', color: 'bg-warning/10 text-warning-foreground border-warning' },
    investigating: { label: 'Investigating', color: 'bg-warning/10 text-warning-foreground border-warning' },
    resolved: { label: 'Resolved', color: 'bg-success/10 text-success border-success' },
    false_positive: { label: 'False Positive', color: 'bg-muted text-muted-foreground border-border' }
  }[status]

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'font-medium',
        config.color,
        className
      )}
    >
      {config.label}
    </Badge>
  )
}
