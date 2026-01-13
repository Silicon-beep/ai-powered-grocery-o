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
import { ConfidenceBadge } from '@/components/ConfidenceBadge'
import { Layout, TrendUp, CheckCircle, ArrowRight } from '@phosphor-icons/react'
import { mockPlacementRecommendations } from '@/lib/mock-data'
import { toast } from 'sonner'

export function ProductPlacementView() {
  const handleApprove = (productName: string) => {
    toast.success('Placement approved', {
      description: `${productName} relocation scheduled for implementation`
    })
  }

  const totalSalesIncrease = mockPlacementRecommendations.reduce(
    (sum, rec) => sum + rec.projectedImpact.salesIncrease,
    0
  )

  const totalBasketIncrease = mockPlacementRecommendations.reduce(
    (sum, rec) => sum + rec.projectedImpact.basketSizeIncrease,
    0
  ) / mockPlacementRecommendations.length

  const totalCLVImpact = mockPlacementRecommendations.reduce(
    (sum, rec) => sum + rec.projectedImpact.clvImpact,
    0
  ) / mockPlacementRecommendations.length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Product Placement</h1>
        <p className="text-muted-foreground mt-1">
          AI-powered merchandising recommendations to increase basket size and CLV
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <Layout className="h-4 w-4 text-accent-foreground" weight="bold" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Recommendations
              </p>
            </div>
            <p className="text-3xl font-bold font-mono">{mockPlacementRecommendations.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-success/10">
                <TrendUp className="h-4 w-4 text-success" weight="bold" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Projected Sales Increase
              </p>
            </div>
            <p className="text-3xl font-bold font-mono text-success">+{totalSalesIncrease.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-success/10">
                <TrendUp className="h-4 w-4 text-success" weight="bold" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Avg Basket Size Increase
              </p>
            </div>
            <p className="text-3xl font-bold font-mono text-success">+{totalBasketIncrease.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Layout className="h-5 w-5 text-accent-foreground" weight="bold" />
            </div>
            <div>
              <CardTitle>Placement Recommendations</CardTitle>
              <CardDescription>AI-driven merchandising strategies based on basket analysis</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Current Location</TableHead>
                <TableHead>Suggested Location</TableHead>
                <TableHead>Projected Impact</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPlacementRecommendations.map((rec) => (
                <TableRow key={rec.recommendationId}>
                  <TableCell>
                    <Badge variant="outline">
                      {rec.type.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{rec.productName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {rec.currentLocation}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ArrowRight size={16} className="text-accent-foreground" weight="bold" />
                      <span className="font-medium text-sm text-accent-foreground">
                        {rec.suggestedLocation}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Sales:</span>
                        <span className="font-mono font-semibold text-success">
                          +{rec.projectedImpact.salesIncrease}%
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Basket:</span>
                        <span className="font-mono font-semibold text-success">
                          +{rec.projectedImpact.basketSizeIncrease}%
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">CLV:</span>
                        <span className="font-mono font-semibold text-success">
                          +{rec.projectedImpact.clvImpact}%
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
                      onClick={() => handleApprove(rec.productName)}
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
          <CardTitle>Detailed Recommendations</CardTitle>
          <CardDescription>Reasoning and analysis for each placement suggestion</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockPlacementRecommendations.map((rec) => (
            <div key={rec.recommendationId} className="p-4 rounded-lg bg-muted/50 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{rec.productName}</h4>
                    <Badge variant="outline">{rec.type.replace(/_/g, ' ')}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {rec.reasoning}
                  </p>
                </div>
                <ConfidenceBadge confidence={rec.confidence} />
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex-1 p-3 rounded bg-background border">
                  <p className="text-xs text-muted-foreground mb-1">Current</p>
                  <p className="font-medium">{rec.currentLocation}</p>
                </div>
                <ArrowRight size={20} className="text-accent-foreground" weight="bold" />
                <div className="flex-1 p-3 rounded bg-accent/10 border border-accent/20">
                  <p className="text-xs text-muted-foreground mb-1">Suggested</p>
                  <p className="font-medium text-accent-foreground">{rec.suggestedLocation}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Sales Impact</p>
                  <p className="font-mono font-semibold text-success">+{rec.projectedImpact.salesIncrease}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Basket Size Impact</p>
                  <p className="font-mono font-semibold text-success">+{rec.projectedImpact.basketSizeIncrease}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">CLV Impact</p>
                  <p className="font-mono font-semibold text-success">+{rec.projectedImpact.clvImpact}%</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Market Basket Analysis</CardTitle>
          <CardDescription>Understanding cross-sell opportunities and merchandising strategy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">Association Rule Mining</h4>
            <p className="text-sm text-muted-foreground">
              The AI agent analyzes millions of basket combinations to identify products frequently purchased together. Association rules 
              are measured by lift (how much more likely items are bought together vs. independently), confidence (probability), and support 
              (frequency). High-lift pairs (2.0+) indicate strong cross-sell opportunities.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Strategic Placement</h4>
            <p className="text-sm text-muted-foreground">
              Placing complementary products near each other increases basket size by reducing search friction. End-cap displays boost 
              visibility by 40-60% for featured products. Eye-level placement (5-6 feet) increases conversion by 20-35% compared to 
              bottom or top shelves.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">A/B Testing Framework</h4>
            <p className="text-sm text-muted-foreground">
              All placement changes should be tracked with before/after metrics. The system monitors sales velocity, basket attachment rate, 
              and overall category performance for 2-4 weeks post-implementation to validate AI predictions and refine future recommendations.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Impact on Customer Lifetime Value</h4>
            <p className="text-sm text-muted-foreground">
              Increased basket size directly improves CLV by increasing transaction value. More importantly, strategic merchandising that helps 
              customers find complementary products enhances shopping experience, reduces trip frequency needs, and builds loyalty. Each 1% 
              increase in basket size correlates with a $45-75 increase in annual customer lifetime value.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
