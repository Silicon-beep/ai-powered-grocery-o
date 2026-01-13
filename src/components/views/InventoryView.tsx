import { useState } from 'react'
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
import { Package, Lightning, CheckCircle, X } from '@phosphor-icons/react'
import { mockInventory } from '@/lib/mock-data'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function InventoryView() {
  const [filter, setFilter] = useState<'all' | 'critical' | 'low' | 'optimal' | 'overstock'>('all')
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  const filteredInventory = filter === 'all' 
    ? mockInventory 
    : mockInventory.filter(item => item.aiInsights.stockStatus === filter)

  const toggleSelection = (productId: string) => {
    const newSelection = new Set(selectedItems)
    if (newSelection.has(productId)) {
      newSelection.delete(productId)
    } else {
      newSelection.add(productId)
    }
    setSelectedItems(newSelection)
  }

  const handleApproveRecommendations = () => {
    const selectedCount = selectedItems.size
    if (selectedCount === 0) {
      toast.error('No items selected')
      return
    }

    toast.success(`Approved ${selectedCount} inventory recommendation${selectedCount !== 1 ? 's' : ''}`, {
      description: 'Purchase orders have been generated and sent to suppliers.'
    })
    setSelectedItems(new Set())
  }

  const handleApproveAll = () => {
    const actionableItems = filteredInventory.filter(
      item => item.aiInsights.recommendedOrderQuantity > 0
    )
    toast.success(`Approved ${actionableItems.length} recommendations`, {
      description: 'Purchase orders have been generated and sent to suppliers.'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered demand forecasting and stock optimization
          </p>
        </div>
        <div className="flex gap-2">
          {selectedItems.size > 0 && (
            <>
              <Button
                variant="outline"
                onClick={() => setSelectedItems(new Set())}
              >
                <X size={16} />
                Clear ({selectedItems.size})
              </Button>
              <Button onClick={handleApproveRecommendations}>
                <CheckCircle size={16} />
                Approve Selected
              </Button>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Package className="h-5 w-5 text-accent-foreground" weight="bold" />
              </div>
              <div>
                <CardTitle>Current Inventory</CardTitle>
                <CardDescription>Real-time stock levels with AI recommendations</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All ({mockInventory.length})
              </Button>
              <Button
                variant={filter === 'critical' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('critical')}
              >
                Critical ({mockInventory.filter(i => i.aiInsights.stockStatus === 'critical').length})
              </Button>
              <Button
                variant={filter === 'low' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('low')}
              >
                Low ({mockInventory.filter(i => i.aiInsights.stockStatus === 'low').length})
              </Button>
              <Button
                variant={filter === 'optimal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('optimal')}
              >
                Optimal ({mockInventory.filter(i => i.aiInsights.stockStatus === 'optimal').length})
              </Button>
              <Button
                variant={filter === 'overstock' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('overstock')}
              >
                Overstock ({mockInventory.filter(i => i.aiInsights.stockStatus === 'overstock').length})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Days Until Stockout</TableHead>
                <TableHead>AI Recommendation</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => {
                const isSelected = selectedItems.has(item.productId)
                return (
                  <TableRow 
                    key={item.productId}
                    className={cn(
                      'cursor-pointer transition-colors',
                      isSelected && 'bg-accent/5'
                    )}
                    onClick={() => toggleSelection(item.productId)}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelection(item.productId)}
                        className="h-4 w-4 rounded border-border"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono font-semibold">
                        {item.currentStock} {item.unitOfMeasure}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={item.aiInsights.stockStatus} />
                    </TableCell>
                    <TableCell>
                      {item.aiInsights.daysUntilStockout !== null ? (
                        <span className={cn(
                          'font-mono font-semibold',
                          item.aiInsights.stockStatus === 'critical' && 'text-destructive',
                          item.aiInsights.stockStatus === 'low' && 'text-warning-foreground'
                        )}>
                          {item.aiInsights.daysUntilStockout.toFixed(1)} days
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.aiInsights.recommendedOrderQuantity > 0 ? (
                        <div className="flex items-center gap-2">
                          <Lightning size={14} className="text-accent-foreground" weight="fill" />
                          <span className="font-mono font-semibold">
                            Order {item.aiInsights.recommendedOrderQuantity} {item.unitOfMeasure}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No action needed</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <ConfidenceBadge confidence={item.aiInsights.confidence} />
                    </TableCell>
                    <TableCell className="text-right">
                      {item.aiInsights.recommendedOrderQuantity > 0 && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            toast.success('Recommendation approved', {
                              description: `Purchase order created for ${item.productName}`
                            })
                          }}
                        >
                          <CheckCircle size={16} />
                          Approve
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {filteredInventory.length === 0 && (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-muted-foreground mb-3" weight="light" />
              <p className="text-muted-foreground">No items in this category</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Insights Explanation</CardTitle>
          <CardDescription>How inventory recommendations are generated</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">Recommendation Logic</h4>
            <p className="text-sm text-muted-foreground">
              The AI agent analyzes 90 days of historical sales data, current inventory levels, and seasonal patterns to forecast demand. 
              Recommendations include safety stock (7 days) and lead time demand (5 days) to prevent stockouts while minimizing excess inventory.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Confidence Scoring</h4>
            <p className="text-sm text-muted-foreground">
              Confidence scores reflect data quality and prediction stability. Higher confidence (85%+) indicates consistent sales patterns 
              and sufficient historical data. Lower confidence suggests volatile demand or limited data history.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Impact on Customer Lifetime Value</h4>
            <p className="text-sm text-muted-foreground">
              Preventing stockouts is critical for CLV optimization. Each stockout incident increases churn risk by 8-12% as customers 
              switch to competitors. Maintaining optimal inventory ensures product availability and customer satisfaction.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
