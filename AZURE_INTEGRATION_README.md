# Azure SQL Database Integration - Quick Start

## Overview

Your StoreAI application is now fully wired to connect to Azure SQL Database through a REST API. All data displayed in the frontend will come from your database once you provide the connection credentials.

## What's Been Implemented

### 1. **API Service Layer** (`src/lib/api-service.ts`)
Complete REST API client with methods for:
- ✅ Store information
- ✅ Inventory management (CRUD operations)
- ✅ Demand forecasting
- ✅ Workforce scheduling
- ✅ Pricing recommendations
- ✅ Product placement recommendations
- ✅ Loss prevention/shrinkage tracking
- ✅ Operational metrics
- ✅ AI agent queries (with database context)

### 2. **Configuration Files**

**Azure SQL Configuration** (`src/lib/azure-sql-config.ts`):
```typescript
export const AZURE_SQL_CONFIG = {
  apiEndpoint: 'https://your-api-endpoint.azurewebsites.net/api',
  apiKey: 'YOUR_API_KEY_HERE',
  enableMockFallback: true  // Uses mock data if API fails
}
```

**Azure OpenAI Configuration** (`src/lib/azure-ai-config.ts`):
```typescript
export const AZURE_AI_CONFIG = {
  endpoint: 'https://your-resource.openai.azure.com',
  apiKey: 'YOUR_AZURE_OPENAI_KEY',
  deploymentName: 'gpt-4',
  apiVersion: '2024-02-15-preview'
}
```

### 3. **React Hooks for Data Fetching**

**`useApiData` Hook** (`src/hooks/use-api-data.ts`):
- Fetches data from API with loading/error states
- Auto-refetch capability
- Success/error callbacks

**`useMutation` Hook** (`src/hooks/use-api-data.ts`):
- Handles POST/PUT/DELETE operations
- Loading states and error handling

### 4. **Updated Components**

All view components now use the API:
- ✅ `OperationsOverview` - Uses metrics, inventory, and shrinkage APIs
- ✅ `InventoryView` - Full CRUD with inventory API
- ✅ `WorkforceView` - Shifts and forecasting APIs
- ✅ `PricingView` - Pricing recommendations API
- ✅ `LossPreventionView` - Shrinkage events API
- ✅ `ProductPlacementView` - Placement recommendations API
- ✅ `AIChatWindow` - Enhanced with database context queries

### 5. **AI Chat with Database Context**

The AI chat window now:
- Queries the database based on user questions
- Provides context-aware responses
- Falls back to Azure OpenAI API when configured
- Works with mock data when API is not configured

---

## How to Configure

### Step 1: Set Up Your REST API

You need to deploy a REST API that connects to Azure SQL Database. See [`AZURE_SQL_SETUP.md`](./AZURE_SQL_SETUP.md) for:
- Database schema SQL scripts
- Required API endpoints specification
- Sample API implementation code
- Security best practices

### Step 2: Configure Frontend

**Edit `src/lib/azure-sql-config.ts`:**

```typescript
export const AZURE_SQL_CONFIG = {
  // Replace with your actual API endpoint
  apiEndpoint: 'https://your-api.azurewebsites.net/api',
  
  // Replace with your API key
  apiKey: 'your-api-key-here',
  
  // Set to false when your API is ready
  enableMockFallback: true
}
```

**Edit `src/lib/azure-ai-config.ts` (optional):**

```typescript
export const AZURE_AI_CONFIG = {
  // Your Azure OpenAI resource endpoint
  endpoint: 'https://your-resource.openai.azure.com',
  
  // Your API key
  apiKey: 'your-key-here',
  
  // Your deployment name
  deploymentName: 'gpt-4',
  
  apiVersion: '2024-02-15-preview'
}
```

### Step 3: Test the Connection

1. Open the browser console
2. Navigate to any view in StoreAI
3. Check the Network tab for API calls
4. Verify responses are coming from your database

---

## Mock Data Fallback

By default, `enableMockFallback: true` means:
- ✅ App works immediately without configuration
- ✅ Mock data is used if API is not configured
- ✅ Mock data is used if API calls fail
- ✅ Perfect for development and testing

When your API is ready:
- Set `enableMockFallback: false` to see real errors
- This helps debug connection issues

---

## API Endpoints Reference

Your REST API must implement these endpoints:

### Store
- `GET /api/store/info` - Get store information

### Inventory
- `GET /api/inventory` - List all inventory items
- `GET /api/inventory/:id` - Get specific item
- `PUT /api/inventory/:id` - Update item
- `POST /api/inventory` - Create item
- `DELETE /api/inventory/:id` - Delete item

### Forecasting
- `GET /api/forecast/demand` - Get demand forecasts
- `GET /api/forecast/demand/:productId` - Get forecast for product

### Workforce
- `GET /api/workforce/shifts?date=YYYY-MM-DD` - Get shifts
- `GET /api/workforce/forecast?date=YYYY-MM-DD` - Get hourly forecast
- `POST /api/workforce/shifts` - Create shift
- `PUT /api/workforce/shifts/:id` - Update shift
- `DELETE /api/workforce/shifts/:id` - Delete shift

### Pricing
- `GET /api/pricing/recommendations` - Get pricing recommendations
- `POST /api/pricing/apply` - Apply price change

### Placement
- `GET /api/placement/recommendations` - Get placement recommendations
- `POST /api/placement/apply` - Apply placement

### Loss Prevention
- `GET /api/loss-prevention/events` - Get shrinkage events
- `PATCH /api/loss-prevention/events/:id` - Update event status

### Metrics
- `GET /api/metrics/operational` - Get operational metrics

### AI Agent (Optional)
- `POST /api/ai/query` - Query AI with context
- `POST /api/ai/chat` - Chat with AI

---

## Architecture

```
┌─────────────────┐
│   React App     │
│   (Frontend)    │
└────────┬────────┘
         │
         │ REST API Calls
         │ (with API Key)
         ▼
┌─────────────────┐
│   REST API      │
│ (Azure Function │
│  or App Service)│
└────────┬────────┘
         │
         │ SQL Queries
         │ (Connection String)
         ▼
┌─────────────────┐
│  Azure SQL DB   │
│   (Database)    │
└─────────────────┘
```

**Frontend → REST API → Database**
- Frontend never connects directly to database
- API handles authentication and queries
- Frontend sends API key in headers

---

## Security Notes

⚠️ **Important Security Practices:**

1. **Never commit credentials to git**
   - Add `azure-sql-config.ts` and `azure-ai-config.ts` to `.gitignore` in production
   - Use environment variables for production deployments

2. **Use API Key Authentication**
   - Generate strong API keys
   - Rotate keys regularly
   - Different keys for dev/staging/production

3. **CORS Configuration**
   - Configure your API to only accept requests from your frontend domain
   - Don't use `*` wildcard in production

4. **SQL Injection Protection**
   - Use parameterized queries in your API
   - Never concatenate user input into SQL strings

5. **Rate Limiting**
   - Implement rate limiting on your API
   - Prevent abuse and DoS attacks

---

## Troubleshooting

### "API not configured" Warning
**Cause:** API endpoint or key contains placeholder text
**Fix:** Update `azure-sql-config.ts` with real values

### API Returns 401/403
**Cause:** Invalid API key
**Fix:** Verify the API key matches your backend configuration

### CORS Errors
**Cause:** API doesn't allow requests from frontend origin
**Fix:** Add CORS headers to your API responses

### Data Not Loading
**Cause:** API endpoint incorrect or database empty
**Fix:** 
1. Check Network tab for API responses
2. Verify database has data
3. Test API with Postman/curl

### AI Chat Not Working
**Cause:** Azure OpenAI not configured or out of quota
**Fix:**
1. Verify credentials in `azure-ai-config.ts`
2. Check Azure OpenAI quota in Azure Portal
3. The chat will still provide database context without OpenAI

---

## Testing Without Database

You can develop and test the entire application without configuring the database:

1. Keep `enableMockFallback: true`
2. Mock data will be used automatically
3. All features work exactly the same
4. Perfect for frontend development

When you're ready to connect to real data, just update the configuration files!

---

## Next Steps

1. ✅ Review this README
2. ✅ Read [`AZURE_SQL_SETUP.md`](./AZURE_SQL_SETUP.md) for database setup
3. ⬜ Create Azure SQL Database
4. ⬜ Deploy REST API middleware
5. ⬜ Update configuration files
6. ⬜ Test connection
7. ⬜ Deploy to production

---

## Support

- **Database Setup**: See `AZURE_SQL_SETUP.md`
- **API Reference**: See `src/lib/api-service.ts`
- **Type Definitions**: See `src/lib/types.ts`

For issues, check the browser console and Network tab for detailed error messages.
