import type { 
  InventoryItem, 
  DemandForecast, 
  HourlyForecast, 
  Shift, 
  PricingRecommendation,
  PlacementRecommendation,
  ShrinkageEvent,
  DataPoint
} from './types'

export const mockStore = {
  storeId: 'STORE-001',
  storeNumber: '4521',
  name: 'Downtown Market',
  region: 'Northeast'
}

const generateDateSeries = (days: number): string[] => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (days - i - 1))
    return date.toISOString().split('T')[0]
  })
}

const generateSalesHistory = (days: number, baseValue: number, variance: number): DataPoint[] => {
  return generateDateSeries(days).map(date => ({
    date,
    value: Math.floor(baseValue + (Math.random() - 0.5) * variance)
  }))
}

export const mockInventory: InventoryItem[] = [
  {
    productId: 'PROD-001',
    productName: 'Organic Milk 1 Gallon',
    category: 'Dairy',
    currentStock: 45,
    unitOfMeasure: 'gallon',
    reorderPoint: 50,
    optimalStock: 120,
    aiInsights: {
      stockStatus: 'low',
      daysUntilStockout: 4.5,
      recommendedOrderQuantity: 75,
      confidence: 0.87,
      reasoning: 'Low stock: 4.5 days remaining. Average daily sales: 10.0 units. Recommend ordering 75 units.'
    },
    lastUpdated: new Date().toISOString()
  },
  {
    productId: 'PROD-002',
    productName: 'Fresh Bread - Whole Wheat',
    category: 'Bakery',
    currentStock: 12,
    unitOfMeasure: 'loaf',
    reorderPoint: 30,
    optimalStock: 80,
    aiInsights: {
      stockStatus: 'critical',
      daysUntilStockout: 1.2,
      recommendedOrderQuantity: 68,
      confidence: 0.92,
      reasoning: 'URGENT: Only 1.2 days of stock remaining at current sales velocity of 10.0 units/day. Recommend immediate order of 68 units.'
    },
    lastUpdated: new Date().toISOString()
  },
  {
    productId: 'PROD-003',
    productName: 'Bananas - Organic',
    category: 'Produce',
    currentStock: 156,
    unitOfMeasure: 'lb',
    reorderPoint: 100,
    optimalStock: 200,
    aiInsights: {
      stockStatus: 'optimal',
      daysUntilStockout: 7.8,
      recommendedOrderQuantity: 44,
      confidence: 0.85,
      reasoning: 'Stock levels optimal. Current inventory supports 8 days of sales.'
    },
    lastUpdated: new Date().toISOString()
  },
  {
    productId: 'PROD-004',
    productName: 'Ground Beef 80/20',
    category: 'Meat',
    currentStock: 234,
    unitOfMeasure: 'lb',
    reorderPoint: 80,
    optimalStock: 150,
    aiInsights: {
      stockStatus: 'overstock',
      daysUntilStockout: 39,
      recommendedOrderQuantity: 0,
      confidence: 0.79,
      reasoning: 'Overstock detected: 39 days of inventory. Consider promotional pricing to accelerate sales.'
    },
    lastUpdated: new Date().toISOString()
  },
  {
    productId: 'PROD-005',
    productName: 'Cheddar Cheese 8oz',
    category: 'Dairy',
    currentStock: 78,
    unitOfMeasure: 'unit',
    reorderPoint: 60,
    optimalStock: 140,
    aiInsights: {
      stockStatus: 'optimal',
      daysUntilStockout: 9.8,
      recommendedOrderQuantity: 62,
      confidence: 0.91,
      reasoning: 'Stock levels optimal. Current inventory supports 10 days of sales.'
    },
    lastUpdated: new Date().toISOString()
  }
]

export const mockDemandForecasts: DemandForecast[] = [
  {
    productId: 'PROD-001',
    productName: 'Organic Milk 1 Gallon',
    historicalSales: generateSalesHistory(30, 10, 4),
    forecast: Array.from({ length: 14 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() + i)
      const baseValue = 10 + Math.sin(i / 7 * Math.PI) * 2
      return {
        date: date.toISOString().split('T')[0],
        value: 0,
        predictedValue: baseValue,
        confidenceLower: baseValue * 0.8,
        confidenceUpper: baseValue * 1.2
      }
    })
  },
  {
    productId: 'PROD-002',
    productName: 'Fresh Bread - Whole Wheat',
    historicalSales: generateSalesHistory(30, 12, 5),
    forecast: Array.from({ length: 14 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() + i)
      const baseValue = 12 + Math.sin(i / 7 * Math.PI) * 3
      return {
        date: date.toISOString().split('T')[0],
        value: 0,
        predictedValue: baseValue,
        confidenceLower: baseValue * 0.75,
        confidenceUpper: baseValue * 1.25
      }
    })
  }
]

export const mockHourlyForecasts: HourlyForecast[] = Array.from({ length: 24 }, (_, hour) => {
  const baseCustomers = hour < 8 || hour > 21 ? 5 : 
                       hour >= 9 && hour <= 11 ? 80 :
                       hour >= 17 && hour <= 19 ? 120 : 45
  
  const recommended = Math.ceil(baseCustomers / 30)
  const scheduled = hour < 8 || hour > 21 ? 1 :
                   hour >= 9 && hour <= 11 ? 2 :
                   hour >= 17 && hour <= 19 ? 3 : 2
  
  return {
    hour,
    predictedCustomers: baseCustomers,
    predictedTransactions: Math.floor(baseCustomers * 0.7),
    recommendedStaffCount: recommended,
    currentlyScheduled: scheduled,
    coverageStatus: scheduled < recommended ? 'understaffed' : 
                   scheduled > recommended ? 'overstaffed' : 'adequate'
  }
})

export const mockShifts: Shift[] = [
  {
    shiftId: 'SHIFT-001',
    employeeId: 'EMP-001',
    employeeName: 'Sarah Johnson',
    role: 'Cashier',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '17:00',
    hours: 8
  },
  {
    shiftId: 'SHIFT-002',
    employeeId: 'EMP-002',
    employeeName: 'Mike Chen',
    role: 'Stocker',
    date: new Date().toISOString().split('T')[0],
    startTime: '06:00',
    endTime: '14:00',
    hours: 8
  },
  {
    shiftId: 'SHIFT-003',
    employeeId: 'EMP-003',
    employeeName: 'Emily Rodriguez',
    role: 'Manager',
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '16:00',
    hours: 8
  },
  {
    shiftId: 'SHIFT-004',
    employeeId: 'EMP-004',
    employeeName: 'David Kim',
    role: 'Cashier',
    date: new Date().toISOString().split('T')[0],
    startTime: '13:00',
    endTime: '21:00',
    hours: 8
  }
]

export const mockPricingRecommendations: PricingRecommendation[] = [
  {
    productId: 'PROD-006',
    productName: 'Fresh Salmon Fillet',
    category: 'Seafood',
    currentPrice: 14.99,
    recommendedPrice: 11.99,
    priceChangePercent: -20,
    reasoning: {
      primary: '2 days to expiration - recommend 20% markdown to move inventory',
      factors: {
        inventoryAge: 5,
        currentVelocity: 3.2,
        demandTrend: 'stable',
        expirationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    },
    projectedImpact: {
      revenueChange: 240,
      unitsChange: 32,
      marginChange: -3.2,
      wasteReduction: 8.5
    },
    confidence: 0.89,
    urgency: 'high'
  },
  {
    productId: 'PROD-007',
    productName: 'Strawberries 1lb',
    category: 'Produce',
    currentPrice: 4.99,
    recommendedPrice: 3.99,
    priceChangePercent: -20,
    reasoning: {
      primary: '3 days to expiration - recommend 20% markdown',
      factors: {
        inventoryAge: 4,
        currentVelocity: 8.5,
        demandTrend: 'stable',
        expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    },
    projectedImpact: {
      revenueChange: 180,
      unitsChange: 65,
      marginChange: -2.8,
      wasteReduction: 12.3
    },
    confidence: 0.92,
    urgency: 'high'
  },
  {
    productId: 'PROD-004',
    productName: 'Ground Beef 80/20',
    category: 'Meat',
    currentPrice: 6.99,
    recommendedPrice: 5.99,
    priceChangePercent: -14,
    reasoning: {
      primary: '39 days of stock - recommend 14% markdown to accelerate sales',
      factors: {
        inventoryAge: 12,
        currentVelocity: 6.0,
        demandTrend: 'decreasing'
      }
    },
    projectedImpact: {
      revenueChange: 420,
      unitsChange: 95,
      marginChange: -1.5,
      wasteReduction: 0
    },
    confidence: 0.78,
    urgency: 'medium'
  }
]

export const mockPlacementRecommendations: PlacementRecommendation[] = [
  {
    recommendationId: 'REC-001',
    type: 'cross_promote',
    productId: 'PROD-008',
    productName: 'Pasta Sauce',
    currentLocation: 'Aisle 4 - Canned Goods',
    suggestedLocation: 'Near Pasta (Aisle 3)',
    reasoning: 'Frequently bought with pasta (lift: 3.2). 68% of pasta purchases include sauce.',
    projectedImpact: {
      salesIncrease: 18.5,
      basketSizeIncrease: 4.2,
      clvImpact: 2.8
    },
    confidence: 0.91
  },
  {
    recommendationId: 'REC-002',
    type: 'end_cap_display',
    productId: 'PROD-009',
    productName: 'Craft Beer Variety Pack',
    currentLocation: 'Aisle 8 - Beer',
    suggestedLocation: 'End Cap Display - Front of Store',
    reasoning: 'High margin item with strong weekend demand. End cap placement increases visibility.',
    projectedImpact: {
      salesIncrease: 32.0,
      basketSizeIncrease: 8.5,
      clvImpact: 5.2
    },
    confidence: 0.85
  },
  {
    recommendationId: 'REC-003',
    type: 'move_product',
    productId: 'PROD-010',
    productName: 'Coffee Beans - Premium',
    currentLocation: 'Aisle 2 - Bottom Shelf',
    suggestedLocation: 'Aisle 2 - Eye Level',
    reasoning: 'Premium product underperforming due to poor visibility. Eye level placement increases conversion.',
    projectedImpact: {
      salesIncrease: 24.0,
      basketSizeIncrease: 3.1,
      clvImpact: 4.5
    },
    confidence: 0.87
  }
]

export const mockShrinkageEvents: ShrinkageEvent[] = [
  {
    eventId: 'SHRINK-001',
    detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    eventType: 'anomaly',
    productName: 'Premium Steaks',
    estimatedLoss: 245.80,
    status: 'investigating'
  },
  {
    eventId: 'SHRINK-002',
    detectedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    eventType: 'inventory_variance',
    productName: 'Wine - Red Blend',
    estimatedLoss: 89.94,
    status: 'investigating'
  },
  {
    eventId: 'SHRINK-003',
    detectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    eventType: 'price_discrepancy',
    productName: 'Organic Chicken',
    estimatedLoss: 34.50,
    status: 'resolved'
  }
]

export const mockOperationalMetrics = {
  clv: {
    label: 'Customer Lifetime Value',
    value: '$2,847',
    change: 12.3,
    changeLabel: 'vs last quarter',
    trend: 'up' as const,
    status: 'success' as const
  },
  revenue: {
    label: 'Revenue (Today)',
    value: '$18,245',
    change: 8.2,
    changeLabel: 'vs yesterday',
    trend: 'up' as const
  },
  basketSize: {
    label: 'Avg Basket Size',
    value: '$47.32',
    change: 5.8,
    changeLabel: 'vs last week',
    trend: 'up' as const
  },
  churnRisk: {
    label: 'High Churn Risk Customers',
    value: 127,
    change: -15.2,
    changeLabel: 'vs last month',
    trend: 'down' as const,
    status: 'success' as const
  },
  stockouts: {
    label: 'Active Stockouts',
    value: 3,
    change: -40,
    changeLabel: 'vs last week',
    trend: 'down' as const,
    status: 'warning' as const
  },
  waste: {
    label: 'Waste Rate',
    value: '2.4%',
    change: -18.5,
    changeLabel: 'vs last month',
    trend: 'down' as const,
    status: 'success' as const
  },
  laborCost: {
    label: 'Labor Cost',
    value: '$3,240',
    change: -8.3,
    changeLabel: 'vs forecast',
    trend: 'down' as const,
    status: 'success' as const
  },
  margin: {
    label: 'Gross Margin',
    value: '24.8%',
    change: 2.1,
    changeLabel: 'vs target',
    trend: 'up' as const
  }
}
