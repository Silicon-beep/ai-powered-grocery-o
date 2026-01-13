import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '@/components/StatusBadge'
import { Users, Clock, CalendarBlank, CheckCircle } from '@phosphor-icons/react'
import { mockShifts, mockHourlyForecasts } from '@/lib/mock-data'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function WorkforceView() {
  const handlePublishSchedule = () => {
    toast.success('Schedule published', {
      description: 'All employees have been notified of their shifts.'
    })
  }

  const totalScheduledHours = mockShifts.reduce((sum, shift) => sum + shift.hours, 0)
  const coverageGaps = mockHourlyForecasts.filter(h => h.coverageStatus === 'understaffed').length
  const optimalHours = mockHourlyForecasts.filter(h => h.coverageStatus === 'adequate').length

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workforce Management</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered scheduling optimization and traffic forecasting
          </p>
        </div>
        <Button onClick={handlePublishSchedule}>
          <CheckCircle size={16} />
          Publish Schedule
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <CalendarBlank className="h-4 w-4 text-accent-foreground" weight="bold" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Today's Shifts
              </p>
            </div>
            <p className="text-3xl font-bold font-mono">{mockShifts.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <Clock className="h-4 w-4 text-accent-foreground" weight="bold" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Scheduled Hours
              </p>
            </div>
            <p className="text-3xl font-bold font-mono">{totalScheduledHours}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className={cn(
                'p-2 rounded-lg',
                coverageGaps > 0 ? 'bg-warning/10' : 'bg-success/10'
              )}>
                <Users className={cn(
                  'h-4 w-4',
                  coverageGaps > 0 ? 'text-warning-foreground' : 'text-success'
                )} weight="bold" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Coverage Gaps
              </p>
            </div>
            <p className={cn(
              'text-3xl font-bold font-mono',
              coverageGaps > 0 ? 'text-warning-foreground' : 'text-success'
            )}>
              {coverageGaps}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle className="h-4 w-4 text-success" weight="bold" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Optimal Hours
              </p>
            </div>
            <p className="text-3xl font-bold font-mono text-success">{optimalHours}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Users className="h-5 w-5 text-accent-foreground" weight="bold" />
            </div>
            <div>
              <CardTitle>Traffic Forecast & Staffing</CardTitle>
              <CardDescription>Hourly customer traffic prediction and recommended staffing levels</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockHourlyForecasts.filter(h => h.hour >= 6 && h.hour <= 22).map((forecast) => {
              const timeLabel = `${forecast.hour.toString().padStart(2, '0')}:00`
              const isPeakHour = forecast.predictedCustomers > 80
              
              return (
                <div 
                  key={forecast.hour}
                  className={cn(
                    'flex items-center gap-4 p-3 rounded-lg border transition-colors',
                    isPeakHour && 'bg-accent/5 border-accent/20'
                  )}
                >
                  <div className="w-16 font-mono font-semibold text-sm">
                    {timeLabel}
                  </div>
                  
                  <div className="flex-1 grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Predicted Customers</p>
                      <p className="font-mono font-semibold text-sm">{forecast.predictedCustomers}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Transactions</p>
                      <p className="font-mono font-semibold text-sm">{forecast.predictedTransactions}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Recommended Staff</p>
                      <p className="font-mono font-semibold text-sm text-accent-foreground">
                        {forecast.recommendedStaffCount}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Currently Scheduled</p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono font-semibold text-sm">
                          {forecast.currentlyScheduled}
                        </p>
                        <StatusBadge status={forecast.coverageStatus} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <CalendarBlank className="h-5 w-5 text-accent-foreground" weight="bold" />
            </div>
            <div>
              <CardTitle>Current Schedule</CardTitle>
              <CardDescription>Today's staff assignments</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockShifts.map((shift) => (
                <TableRow key={shift.shiftId}>
                  <TableCell className="font-medium">{shift.employeeName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{shift.role}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {new Date(shift.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-mono font-semibold">{shift.startTime}</TableCell>
                  <TableCell className="font-mono font-semibold">{shift.endTime}</TableCell>
                  <TableCell>
                    <span className="font-mono font-semibold">{shift.hours}h</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workforce Optimization Insights</CardTitle>
          <CardDescription>How AI improves scheduling efficiency</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">Traffic Prediction Model</h4>
            <p className="text-sm text-muted-foreground">
              The AI agent analyzes historical transaction data by hour/day/week to identify traffic patterns. It accounts for seasonality, 
              day of week effects, holidays, and local events to forecast customer volume with 85-90% accuracy.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Staffing Optimization</h4>
            <p className="text-sm text-muted-foreground">
              Recommended staffing levels balance service quality and labor costs. The algorithm assumes 1 staff member per 30 customers 
              during peak hours, with adjustments for role-specific requirements (cashiers, stockers, managers).
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Cost Efficiency</h4>
            <p className="text-sm text-muted-foreground">
              By aligning staff schedules with predicted demand, stores typically achieve 8-12% labor cost reduction while maintaining or 
              improving service levels. Eliminating understaffing prevents lost sales during peak periods.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Impact on Customer Lifetime Value</h4>
            <p className="text-sm text-muted-foreground">
              Proper staffing during peak hours reduces wait times and improves customer experience. Each minute reduction in checkout time 
              correlates with a 2-3% increase in customer satisfaction scores and reduces churn risk.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
