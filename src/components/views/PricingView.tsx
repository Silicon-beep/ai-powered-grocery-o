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
import { ConfidenceBadge } from '@/components/ConfidenceBadge'
import { Tag, Lightning, CheckCircle, TrendUp, TrendDown } from '@phosphor-icons/react'
import { mockPricingRecommendations } from '@/lib/mock-data'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function PricingView() {
  const handleApprove = (productName: string, recommendedPrice: number) => {
    toast.success('Pricing approved', {
      description: `${productName} price updated to $${recommendedPrice.toFixed(2)}`
    })
  }

  const handleApproveAll = () => {
    toast.success(`Approved ${mockPricingRecommendations.length} pricing changes`, {
      description: 'Prices will update in POS within 5 minutes.'
    })
  }

  const totalRevenueImpact = mockPricingRecommendations.reduce(
    (sum, rec) => sum + rec.projectedImpact.revenueChange, 
    0
  )
  
  const totalWasteReduction = mockPricingRecommendations.reduce(
    (sum, rec) => sum + rec.projectedImpact.wasteReduction, 
    0
  )

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dynamic Pricing</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered pricing optimization for perishables and high-demand items
          </p>
        </div>
        <Button onClick={handleApproveAll}>
          <CheckCircle size={16} />
          Approve All Recommendations
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <Lightning className="h-4 w-4 text-accent-foreground" weight="fill" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Pending Recommendations
              </p>
            </div>
            <p className="text-3xl font-bold font-mono">{mockPricingRecommendations.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-success/10">
                <TrendUp className="h-4 w-4 text-success" weight="bold" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Projected Revenue Impact
              </p>
            </div>
            <p className={cn(
              'text-3xl font-bold font-mono',
              totalRevenueImpact >= 0 ? 'text-success' : 'text-destructive'
            )}>
              {totalRevenueImpact >= 0 ? '+' : ''}${totalRevenueImpact.toFixed(0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-success/10">
                <TrendDown className="h-4 w-4 text-success" weight="bold" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Waste Reduction
              </p>
            </div>
            <p className="text-3xl font-bold font-mono text-success">
              {totalWasteReduction.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Tag className="h-5 w-5 text-accent-foreground" weight="bold" />
            </div>
            <div>
              <CardTitle>Pricing Recommendations</CardTitle>
              <CardDescription>AI-generated price adjustments based on demand, inventory, and margins</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>Recommended Price</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Projected Impact</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPricingRecommendations.map((rec) => (
                <TableRow key={rec.productId}>
                  <TableCell className="font-medium">{rec.productName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{rec.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono font-semibold">
                      ${rec.currentPrice.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono font-semibold text-accent-foreground">
                      ${rec.recommendedPrice.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TrendDown 
                        size={16} 
                        className={cn(
                          rec.priceChangePercent < 0 ? 'text-warning-foreground' : 'text-success'
                        )}
                        weight="bold"
                      />
                      <span className={cn(
                        'font-mono font-semibold',
                        rec.priceChangePercent < 0 ? 'text-warning-foreground' : 'text-success'
                      )}>
                        {rec.priceChangePercent}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={rec.urgency} />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Revenue:</span>
                        <span className={cn(
                          'font-mono font-semibold',
                          rec.projectedImpact.revenueChange >= 0 ? 'text-success' : 'text-destructive'
                        )}>
                          {rec.projectedImpact.revenueChange >= 0 ? '+' : ''}${rec.projectedImpact.revenueChange}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Waste:</span>
                        <span className="font-mono font-semibold text-success">
                          -{rec.projectedImpact.wasteReduction}%
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <ConfidenceBadge confidence={rec.confidence} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm"
                      onClick={() => handleApprove(rec.productName, rec.recommendedPrice)}
                    >
                      <CheckCircle size={16} />
                      Approve
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
          <CardTitle>Pricing Reasoning</CardTitle>
          <CardDescription>Detailed explanations for each recommendation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockPricingRecommendations.map((rec) => (
            <div key={rec.productId} className="p-4 rounded-lg bg-muted/50 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-sm">{rec.productName}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {rec.reasoning.primary}
                  </p>
                </div>
                <StatusBadge status={rec.urgency} />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-muted-foreground mb-1">Inventory Age</p>
                  <p className="font-mono font-semibold">{rec.reasoning.factors.inventoryAge} days</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Sales Velocity</p>
                  <p className="font-mono font-semibold">{rec.reasoning.factors.currentVelocity} units/day</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Demand Trend</p>
                  <Badge variant="outline" className="font-mono">
                    {rec.reasoning.factors.demandTrend}
                  </Badge>
                </div>
                {rec.reasoning.factors.expirationDate && (
                  <div>
                    <p className="text-muted-foreground mb-1">Expires</p>
                    <p className="font-mono font-semibold">
                      {new Date(rec.reasoning.factors.expirationDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing Strategy Overview</CardTitle>
          <CardDescription>How dynamic pricing optimizes profitability and reduces waste</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">Perishable Goods Management</h4>
            <p className="text-sm text-muted-foreground">
              For perishable items, the AI agent considers days until expiration, current inventory velocity, and historical markdown effectiveness. 
              Aggressive markdowns (15-30%) are recommended 2-3 days before expiration to maximize recovery value while minimizing waste.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Demand-Based Optimization</h4>
            <p className="text-sm text-muted-foreground">
              Prices are adjusted based on demand elasticity. High-demand items can support price increases while maintaining volume. 
              Slow-moving items receive strategic markdowns to free up shelf space and working capital.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Margin Protection</h4>
            <p className="text-sm text-muted-foreground">
              All recommendations maintain minimum margin thresholds (10% by default). The system prioritizes maximizing total contribution 
              (price × volume) rather than pursuing maximum price or volume independently.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Impact on Customer Lifetime Value</h4>
            <p className="text-sm text-muted-foreground">
              Strategic pricing on perishables demonstrates value to customers while maintaining profitability. Customers perceive the store 
              as offering fair prices and fresh products, both of which increase retention and lifetime value.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
