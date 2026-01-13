export interface Store {
  storeId: string
  storeNumber: string
  name: string
  region: string
}

export interface InventoryItem {
  productId: string
  productName: string
  category: string
  currentStock: number
  unitOfMeasure: string
  reorderPoint: number
  optimalStock: number
  aiInsights: {
    stockStatus: 'optimal' | 'low' | 'critical' | 'overstock'
    daysUntilStockout: number | null
    recommendedOrderQuantity: number
    confidence: number
    reasoning: string
  }
  lastUpdated: string
}

export interface DataPoint {
  date: string
  value: number
}

export interface ForecastPoint extends DataPoint {
  predictedValue: number
  confidenceLower: number
  confidenceUpper: number
}

export interface DemandForecast {
  productId: string
  productName: string
  historicalSales: DataPoint[]
  forecast: ForecastPoint[]
}

export interface Shift {
  shiftId: string
  employeeId: string
  employeeName: string
  role: string
  date: string
  startTime: string
  endTime: string
  hours: number
}

export interface HourlyForecast {
  hour: number
  predictedCustomers: number
  predictedTransactions: number
  recommendedStaffCount: number
  currentlyScheduled: number
  coverageStatus: 'adequate' | 'understaffed' | 'overstaffed'
}

export interface PricingRecommendation {
  productId: string
  productName: string
  category: string
  currentPrice: number
  recommendedPrice: number
  priceChangePercent: number
  reasoning: {
    primary: string
    factors: {
      inventoryAge: number
      currentVelocity: number
      demandTrend: 'increasing' | 'stable' | 'decreasing'
      expirationDate?: string
    }
  }
  projectedImpact: {
    revenueChange: number
    unitsChange: number
    marginChange: number
    wasteReduction: number
  }
  confidence: number
  urgency: 'high' | 'medium' | 'low'
}

export interface PlacementRecommendation {
  recommendationId: string
  type: 'move_product' | 'cross_promote' | 'end_cap_display'
  productId: string
  productName: string
  currentLocation: string
  suggestedLocation: string
  reasoning: string
  projectedImpact: {
    salesIncrease: number
    basketSizeIncrease: number
    clvImpact: number
  }
  confidence: number
}

export interface ShrinkageEvent {
  eventId: string
  detectedAt: string
  eventType: 'anomaly' | 'inventory_variance' | 'price_discrepancy'
  productName: string
  estimatedLoss: number
  status: 'investigating' | 'resolved' | 'false_positive'
}

export interface MetricCard {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  trend?: 'up' | 'down' | 'stable'
  status?: 'success' | 'warning' | 'critical'
}
