export const AZURE_SQL_CONFIG = {
  apiEndpoint: 'https://your-api-endpoint.azurewebsites.net/api',
  apiKey: 'YOUR_API_KEY_HERE',
  connectionString: '',
  database: 'StoreAIDB',
  enableMockFallback: true
}

export const API_ENDPOINTS = {
  store: {
    getInfo: '/store/info',
  },
  inventory: {
    getAll: '/inventory',
    getById: '/inventory/:id',
    update: '/inventory/:id',
    create: '/inventory',
    delete: '/inventory/:id',
  },
  demandForecast: {
    getAll: '/forecast/demand',
    getByProduct: '/forecast/demand/:productId',
  },
  workforce: {
    getShifts: '/workforce/shifts',
    getHourlyForecast: '/workforce/forecast',
    createShift: '/workforce/shifts',
    updateShift: '/workforce/shifts/:id',
    deleteShift: '/workforce/shifts/:id',
  },
  pricing: {
    getRecommendations: '/pricing/recommendations',
    applyPriceChange: '/pricing/apply',
  },
  placement: {
    getRecommendations: '/placement/recommendations',
    applyPlacement: '/placement/apply',
  },
  lossPrevention: {
    getShrinkageEvents: '/loss-prevention/events',
    updateEventStatus: '/loss-prevention/events/:id',
  },
  metrics: {
    getOperational: '/metrics/operational',
  },
  aiAgent: {
    query: '/ai/query',
    chat: '/ai/chat',
  }
} as const
