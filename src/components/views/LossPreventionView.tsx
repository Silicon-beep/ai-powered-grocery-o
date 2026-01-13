import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '@/components/StatusBadge'
import { ShieldWarning, MagnifyingGlass, CheckCircle } from '@phosphor-icons/react'
import { lossPreventionApi } from '@/lib/api-service'
import { useApiData } from '@/hooks/use-api-data'
import { toast } from 'sonner'

export function LossPreventionView() {
  const { data: shrinkageEvents } = useApiData(lossPreventionApi.getShrinkageEvents)

  const activeEvents = shrinkageEvents?.filter(e => e.status === 'investigating') || []
  const totalLoss = activeEvents.reduce((sum, e) => sum + e.estimatedLoss, 0)

  const handleInvestigate = (eventId: string, productName: string) => {
    toast.info('Investigation opened', {
      description: `Investigating shrinkage event for ${productName}`
    })
  }

  const handleResolve = (eventId: string) => {
    toast.success('Event resolved', {
      description: 'Shrinkage event marked as resolved'
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Loss Prevention</h1>
        <p className="text-muted-foreground mt-1">
          AI-powered anomaly detection for shrinkage and fraud
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-warning/10">
                <ShieldWarning className="h-4 w-4 text-warning-foreground" weight="bold" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Investigations
              </p>
            </div>
            <p className="text-3xl font-bold font-mono text-warning-foreground">{activeEvents.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-destructive/10">
                <ShieldWarning className="h-4 w-4 text-destructive" weight="bold" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Estimated Loss (Active)
              </p>
            </div>
            <p className="text-3xl font-bold font-mono text-destructive">${totalLoss.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle className="h-4 w-4 text-success" weight="bold" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Resolved This Month
              </p>
            </div>
            <p className="text-3xl font-bold font-mono text-success">12</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <ShieldWarning className="h-5 w-5 text-accent-foreground" weight="bold" />
            </div>
            <div>
              <CardTitle>Shrinkage Events</CardTitle>
              <CardDescription>Detected anomalies and inventory discrepancies</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Detected At</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Estimated Loss</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shrinkageEvents?.map((event) => (
                <TableRow key={event.eventId}>
                  <TableCell className="font-mono text-sm">
                    {new Date(event.detectedAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {event.eventType.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{event.productName}</TableCell>
                  <TableCell>
                    <span className="font-mono font-semibold text-destructive">
                      ${event.estimatedLoss.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={event.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      {event.status === 'investigating' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleInvestigate(event.eventId, event.productName)}
                          >
                            <MagnifyingGlass size={16} />
                            Details
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleResolve(event.eventId)}
                          >
                            <CheckCircle size={16} />
                            Resolve
                          </Button>
                        </>
                      )}
                      {event.status === 'resolved' && (
                        <Button size="sm" variant="ghost">
                          View Report
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Loss Prevention Methodology</CardTitle>
          <CardDescription>How the AI agent detects and flags anomalies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">Anomaly Detection</h4>
            <p className="text-sm text-muted-foreground">
              The system continuously monitors inventory levels, transaction patterns, and pricing data. Statistical models identify deviations 
              from expected patterns that could indicate shrinkage, theft, or operational errors. Alerts are generated when anomalies exceed 
              configured thresholds.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Event Types</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><span className="font-semibold text-foreground">Inventory Variance:</span> Detected when physical counts don't match system records beyond acceptable variance.</p>
              <p><span className="font-semibold text-foreground">Anomaly:</span> Unusual transaction patterns, such as excessive voids, refunds, or after-hours activity.</p>
              <p><span className="font-semibold text-foreground">Price Discrepancy:</span> Items sold at incorrect prices, potentially indicating manual override abuse.</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Investigation Workflow</h4>
            <p className="text-sm text-muted-foreground">
              When an event is flagged, managers can review detailed transaction logs, video footage timestamps (if integrated), and employee 
              activity. The system provides contextual information to expedite investigations while maintaining a complete audit trail.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Impact on Profitability</h4>
            <p className="text-sm text-muted-foreground">
              Industry average shrinkage is 1.5-2% of revenue. Reducing shrinkage by even 0.5 percentage points can translate to $100K+ annually 
              for a medium-sized store. Early detection prevents systematic losses and deters future incidents.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
