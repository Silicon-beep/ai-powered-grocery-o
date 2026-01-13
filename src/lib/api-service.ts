import { AZURE_SQL_CONFIG, API_ENDPOINTS } from './azure-sql-config'
import type {
  Store,
  InventoryItem,
  DemandForecast,
  HourlyForecast,
  Shift,
  PricingRecommendation,
  PlacementRecommendation,
  ShrinkageEvent,
  MetricCard
} from './types'
import {
  mockStore,
  mockInventory,
  mockDemandForecasts,
  mockHourlyForecasts,
  mockShifts,
  mockPricingRecommendations,
  mockPlacementRecommendations,
  mockShrinkageEvents,
  mockOperationalMetrics
} from './mock-data'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchFromAPI<T>(
  endpoint: string,
  options: RequestInit = {},
  mockFallback?: T
): Promise<T> {
  const { apiEndpoint, apiKey, enableMockFallback } = AZURE_SQL_CONFIG

  if (!apiEndpoint || !apiKey || apiEndpoint.includes('your-api-endpoint')) {
    console.warn('Azure SQL API not configured. Using mock data.')
    if (mockFallback !== undefined) {
      return mockFallback
    }
    throw new Error('API not configured and no mock data available')
  }

  const url = `${apiEndpoint}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        ...options.headers,
      },
    })

    if (!response.ok) {
      if (enableMockFallback && mockFallback !== undefined) {
        console.warn(`API call failed (${response.status}). Falling back to mock data.`)
        return mockFallback
      }
      throw new ApiError(
        response.status,
        `API request failed: ${response.statusText}`
      )
    }

    return await response.json()
  } catch (error) {
    if (enableMockFallback && mockFallback !== undefined) {
      console.warn('API call failed. Falling back to mock data.', error)
      return mockFallback
    }
    throw error
  }
}

export const storeApi = {
  getInfo: async (): Promise<Store> => {
    return fetchFromAPI<Store>(API_ENDPOINTS.store.getInfo, {}, mockStore)
  },
}

export const inventoryApi = {
  getAll: async (): Promise<InventoryItem[]> => {
    return fetchFromAPI<InventoryItem[]>(
      API_ENDPOINTS.inventory.getAll,
      {},
      mockInventory
    )
  },

  getById: async (id: string): Promise<InventoryItem> => {
    const endpoint = API_ENDPOINTS.inventory.getById.replace(':id', id)
    const mockItem = mockInventory.find(item => item.productId === id)
    return fetchFromAPI<InventoryItem>(endpoint, {}, mockItem)
  },

  update: async (id: string, data: Partial<InventoryItem>): Promise<InventoryItem> => {
    const endpoint = API_ENDPOINTS.inventory.update.replace(':id', id)
    return fetchFromAPI<InventoryItem>(
      endpoint,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      { ...mockInventory[0], ...data } as InventoryItem
    )
  },

  create: async (data: Omit<InventoryItem, 'productId'>): Promise<InventoryItem> => {
    return fetchFromAPI<InventoryItem>(
      API_ENDPOINTS.inventory.create,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      { productId: `PROD-${Date.now()}`, ...data } as InventoryItem
    )
  },

  delete: async (id: string): Promise<void> => {
    const endpoint = API_ENDPOINTS.inventory.delete.replace(':id', id)
    return fetchFromAPI<void>(
      endpoint,
      {
        method: 'DELETE',
      },
      undefined
    )
  },
}

export const demandForecastApi = {
  getAll: async (): Promise<DemandForecast[]> => {
    return fetchFromAPI<DemandForecast[]>(
      API_ENDPOINTS.demandForecast.getAll,
      {},
      mockDemandForecasts
    )
  },

  getByProduct: async (productId: string): Promise<DemandForecast> => {
    const endpoint = API_ENDPOINTS.demandForecast.getByProduct.replace(':productId', productId)
    const mockItem = mockDemandForecasts.find(f => f.productId === productId)
    return fetchFromAPI<DemandForecast>(endpoint, {}, mockItem)
  },
}

export const workforceApi = {
  getShifts: async (date?: string): Promise<Shift[]> => {
    const params = date ? `?date=${date}` : ''
    return fetchFromAPI<Shift[]>(
      `${API_ENDPOINTS.workforce.getShifts}${params}`,
      {},
      mockShifts
    )
  },

  getHourlyForecast: async (date?: string): Promise<HourlyForecast[]> => {
    const params = date ? `?date=${date}` : ''
    return fetchFromAPI<HourlyForecast[]>(
      `${API_ENDPOINTS.workforce.getHourlyForecast}${params}`,
      {},
      mockHourlyForecasts
    )
  },

  createShift: async (data: Omit<Shift, 'shiftId'>): Promise<Shift> => {
    return fetchFromAPI<Shift>(
      API_ENDPOINTS.workforce.createShift,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      { shiftId: `SHIFT-${Date.now()}`, ...data } as Shift
    )
  },

  updateShift: async (id: string, data: Partial<Shift>): Promise<Shift> => {
    const endpoint = API_ENDPOINTS.workforce.updateShift.replace(':id', id)
    return fetchFromAPI<Shift>(
      endpoint,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      { ...mockShifts[0], ...data } as Shift
    )
  },

  deleteShift: async (id: string): Promise<void> => {
    const endpoint = API_ENDPOINTS.workforce.deleteShift.replace(':id', id)
    return fetchFromAPI<void>(
      endpoint,
      {
        method: 'DELETE',
      },
      undefined
    )
  },
}

export const pricingApi = {
  getRecommendations: async (): Promise<PricingRecommendation[]> => {
    return fetchFromAPI<PricingRecommendation[]>(
      API_ENDPOINTS.pricing.getRecommendations,
      {},
      mockPricingRecommendations
    )
  },

  applyPriceChange: async (
    productId: string,
    newPrice: number
  ): Promise<{ success: boolean; message: string }> => {
    return fetchFromAPI<{ success: boolean; message: string }>(
      API_ENDPOINTS.pricing.applyPriceChange,
      {
        method: 'POST',
        body: JSON.stringify({ productId, newPrice }),
      },
      { success: true, message: 'Price updated successfully' }
    )
  },
}

export const placementApi = {
  getRecommendations: async (): Promise<PlacementRecommendation[]> => {
    return fetchFromAPI<PlacementRecommendation[]>(
      API_ENDPOINTS.placement.getRecommendations,
      {},
      mockPlacementRecommendations
    )
  },

  applyPlacement: async (
    recommendationId: string
  ): Promise<{ success: boolean; message: string }> => {
    return fetchFromAPI<{ success: boolean; message: string }>(
      API_ENDPOINTS.placement.applyPlacement,
      {
        method: 'POST',
        body: JSON.stringify({ recommendationId }),
      },
      { success: true, message: 'Placement recommendation applied successfully' }
    )
  },
}

export const lossPreventionApi = {
  getShrinkageEvents: async (): Promise<ShrinkageEvent[]> => {
    return fetchFromAPI<ShrinkageEvent[]>(
      API_ENDPOINTS.lossPrevention.getShrinkageEvents,
      {},
      mockShrinkageEvents
    )
  },

  updateEventStatus: async (
    eventId: string,
    status: ShrinkageEvent['status']
  ): Promise<ShrinkageEvent> => {
    const endpoint = API_ENDPOINTS.lossPrevention.updateEventStatus.replace(':id', eventId)
    return fetchFromAPI<ShrinkageEvent>(
      endpoint,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      },
      { ...mockShrinkageEvents[0], eventId, status } as ShrinkageEvent
    )
  },
}

export const metricsApi = {
  getOperational: async (): Promise<Record<string, MetricCard>> => {
    return fetchFromAPI<Record<string, MetricCard>>(
      API_ENDPOINTS.metrics.getOperational,
      {},
      mockOperationalMetrics
    )
  },
}

export const aiAgentApi = {
  query: async (query: string, context?: Record<string, unknown>): Promise<string> => {
    return fetchFromAPI<string>(
      API_ENDPOINTS.aiAgent.query,
      {
        method: 'POST',
        body: JSON.stringify({ query, context }),
      },
      'AI agent response (mock data - configure Azure AI endpoint)'
    )
  },

  chat: async (
    messages: Array<{ role: string; content: string }>
  ): Promise<{ response: string; data?: unknown }> => {
    return fetchFromAPI<{ response: string; data?: unknown }>(
      API_ENDPOINTS.aiAgent.chat,
      {
        method: 'POST',
        body: JSON.stringify({ messages }),
      },
      {
        response: 'AI chat response (mock data - configure Azure AI endpoint)',
        data: null
      }
    )
  },
}
