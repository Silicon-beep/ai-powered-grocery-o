import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'optimal' | 'low' | 'critical' | 'overstock' | 'adequate' | 'understaffed' | 'overstaffed' | 'high' | 'medium' | 'low' | 'investigating' | 'resolved' | 'false_positive'
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = {
    optimal: { label: 'Optimal', color: 'bg-success/20 text-success border-success shadow-sm shadow-success/20' },
    low: { label: 'Low', color: 'bg-warning/20 text-warning-foreground border-warning shadow-sm shadow-warning/20' },
    critical: { label: 'Critical', color: 'bg-destructive/20 text-destructive border-destructive shadow-sm shadow-destructive/20' },
    overstock: { label: 'Overstock', color: 'bg-warning/20 text-warning-foreground border-warning shadow-sm shadow-warning/20' },
    adequate: { label: 'Adequate', color: 'bg-success/20 text-success border-success shadow-sm shadow-success/20' },
    understaffed: { label: 'Understaffed', color: 'bg-destructive/20 text-destructive border-destructive shadow-sm shadow-destructive/20' },
    overstaffed: { label: 'Overstaffed', color: 'bg-warning/20 text-warning-foreground border-warning shadow-sm shadow-warning/20' },
    high: { label: 'High', color: 'bg-destructive/20 text-destructive border-destructive shadow-sm shadow-destructive/20' },
    medium: { label: 'Medium', color: 'bg-warning/20 text-warning-foreground border-warning shadow-sm shadow-warning/20' },
    investigating: { label: 'Investigating', color: 'bg-warning/20 text-warning-foreground border-warning shadow-sm shadow-warning/20' },
    resolved: { label: 'Resolved', color: 'bg-success/20 text-success border-success shadow-sm shadow-success/20' },
    false_positive: { label: 'False Positive', color: 'bg-muted text-muted-foreground border-border' }
  }[status]

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'font-bold text-xs border-2',
        config.color,
        className
      )}
    >
      {config.label}
    </Badge>
  )
}
