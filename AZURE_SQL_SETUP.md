# Azure SQL Database Setup Guide

This document explains how to configure StoreAI to connect to your Azure SQL Database instance and Azure OpenAI services.

## Overview

StoreAI is configured to work with:
1. **Azure SQL Database** - Stores all operational data (inventory, workforce, metrics, etc.)
2. **REST API Layer** - Middleware API that connects the frontend to Azure SQL
3. **Azure OpenAI** - Powers the AI chat assistant with database context

## Prerequisites

- Azure subscription with active credits
- Azure SQL Database instance
- REST API deployed (Azure Functions, App Service, or Container Apps)
- Azure OpenAI service (optional, for AI chat)

---

## Part 1: Azure SQL Database Configuration

### Step 1: Create Azure SQL Database

1. Go to Azure Portal: https://portal.azure.com
2. Create a new **Azure SQL Database**
3. Note down the following:
   - **Server name**: `your-server.database.windows.net`
   - **Database name**: `StoreAIDB` (or your chosen name)
   - **Admin username**
   - **Admin password**

### Step 2: Configure Firewall Rules

1. Navigate to your SQL Server in Azure Portal
2. Go to **Networking** under Security
3. Add your client IP address to the firewall rules
4. Enable "Allow Azure services and resources to access this server"

### Step 3: Create Database Schema

Connect to your database using Azure Data Studio or SQL Server Management Studio and run the following schema:

```sql
-- Store Information
CREATE TABLE Stores (
    StoreId NVARCHAR(50) PRIMARY KEY,
    StoreNumber NVARCHAR(20) NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    Region NVARCHAR(100) NOT NULL
);

-- Inventory Items
CREATE TABLE Inventory (
    ProductId NVARCHAR(50) PRIMARY KEY,
    ProductName NVARCHAR(200) NOT NULL,
    Category NVARCHAR(100) NOT NULL,
    CurrentStock INT NOT NULL,
    UnitOfMeasure NVARCHAR(50) NOT NULL,
    ReorderPoint INT NOT NULL,
    OptimalStock INT NOT NULL,
    StockStatus NVARCHAR(20) NOT NULL,
    DaysUntilStockout FLOAT,
    RecommendedOrderQuantity INT NOT NULL,
    Confidence FLOAT NOT NULL,
    Reasoning NVARCHAR(MAX) NOT NULL,
    LastUpdated DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- Demand Forecasts
CREATE TABLE DemandForecasts (
    ForecastId INT IDENTITY(1,1) PRIMARY KEY,
    ProductId NVARCHAR(50) NOT NULL,
    ForecastDate DATE NOT NULL,
    PredictedValue FLOAT NOT NULL,
    ConfidenceLower FLOAT NOT NULL,
    ConfidenceUpper FLOAT NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (ProductId) REFERENCES Inventory(ProductId)
);

-- Workforce Shifts
CREATE TABLE Shifts (
    ShiftId NVARCHAR(50) PRIMARY KEY,
    EmployeeId NVARCHAR(50) NOT NULL,
    EmployeeName NVARCHAR(200) NOT NULL,
    Role NVARCHAR(100) NOT NULL,
    ShiftDate DATE NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    Hours DECIMAL(5,2) NOT NULL
);

-- Hourly Workforce Forecasts
CREATE TABLE HourlyForecasts (
    ForecastId INT IDENTITY(1,1) PRIMARY KEY,
    ForecastDate DATE NOT NULL,
    Hour INT NOT NULL,
    PredictedCustomers INT NOT NULL,
    PredictedTransactions INT NOT NULL,
    RecommendedStaffCount INT NOT NULL,
    CurrentlyScheduled INT NOT NULL,
    CoverageStatus NVARCHAR(20) NOT NULL,
    CONSTRAINT UQ_DateHour UNIQUE (ForecastDate, Hour)
);

-- Pricing Recommendations
CREATE TABLE PricingRecommendations (
    RecommendationId INT IDENTITY(1,1) PRIMARY KEY,
    ProductId NVARCHAR(50) NOT NULL,
    ProductName NVARCHAR(200) NOT NULL,
    Category NVARCHAR(100) NOT NULL,
    CurrentPrice DECIMAL(10,2) NOT NULL,
    RecommendedPrice DECIMAL(10,2) NOT NULL,
    PriceChangePercent DECIMAL(5,2) NOT NULL,
    ReasoningPrimary NVARCHAR(MAX) NOT NULL,
    InventoryAge INT,
    CurrentVelocity DECIMAL(10,2),
    DemandTrend NVARCHAR(20),
    ExpirationDate DATETIME2,
    ProjectedRevenueChange DECIMAL(10,2) NOT NULL,
    ProjectedUnitsChange INT NOT NULL,
    ProjectedMarginChange DECIMAL(5,2) NOT NULL,
    ProjectedWasteReduction DECIMAL(5,2) NOT NULL,
    Confidence DECIMAL(5,2) NOT NULL,
    Urgency NVARCHAR(20) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- Product Placement Recommendations
CREATE TABLE PlacementRecommendations (
    RecommendationId NVARCHAR(50) PRIMARY KEY,
    Type NVARCHAR(50) NOT NULL,
    ProductId NVARCHAR(50) NOT NULL,
    ProductName NVARCHAR(200) NOT NULL,
    CurrentLocation NVARCHAR(200) NOT NULL,
    SuggestedLocation NVARCHAR(200) NOT NULL,
    Reasoning NVARCHAR(MAX) NOT NULL,
    ProjectedSalesIncrease DECIMAL(5,2) NOT NULL,
    ProjectedBasketSizeIncrease DECIMAL(5,2) NOT NULL,
    ProjectedCLVImpact DECIMAL(5,2) NOT NULL,
    Confidence DECIMAL(5,2) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- Shrinkage Events
CREATE TABLE ShrinkageEvents (
    EventId NVARCHAR(50) PRIMARY KEY,
    DetectedAt DATETIME2 NOT NULL,
    EventType NVARCHAR(50) NOT NULL,
    ProductName NVARCHAR(200) NOT NULL,
    EstimatedLoss DECIMAL(10,2) NOT NULL,
    Status NVARCHAR(50) NOT NULL,
    ResolvedAt DATETIME2
);

-- Operational Metrics
CREATE TABLE OperationalMetrics (
    MetricId INT IDENTITY(1,1) PRIMARY KEY,
    MetricKey NVARCHAR(50) NOT NULL,
    Label NVARCHAR(200) NOT NULL,
    Value NVARCHAR(50) NOT NULL,
    ChangePercent DECIMAL(5,2),
    ChangeLabel NVARCHAR(100),
    Trend NVARCHAR(20),
    Status NVARCHAR(20),
    Timestamp DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT UQ_MetricKey_Timestamp UNIQUE (MetricKey, Timestamp)
);

-- Create indexes for performance
CREATE INDEX IX_Inventory_StockStatus ON Inventory(StockStatus);
CREATE INDEX IX_DemandForecasts_ProductId ON DemandForecasts(ProductId);
CREATE INDEX IX_Shifts_ShiftDate ON Shifts(ShiftDate);
CREATE INDEX IX_HourlyForecasts_Date ON HourlyForecasts(ForecastDate);
CREATE INDEX IX_PricingRecommendations_Urgency ON PricingRecommendations(Urgency);
CREATE INDEX IX_ShrinkageEvents_Status ON ShrinkageEvents(Status);
CREATE INDEX IX_OperationalMetrics_Key ON OperationalMetrics(MetricKey);
```

---

## Part 2: REST API Configuration

You need to deploy a REST API that connects to your Azure SQL Database. This API should expose endpoints defined in `src/lib/azure-sql-config.ts`.

### Required API Endpoints

Your REST API must implement these endpoints:

#### Store Endpoints
- `GET /api/store/info` - Get store information

#### Inventory Endpoints
- `GET /api/inventory` - Get all inventory items
- `GET /api/inventory/:id` - Get specific inventory item
- `PUT /api/inventory/:id` - Update inventory item
- `POST /api/inventory` - Create new inventory item
- `DELETE /api/inventory/:id` - Delete inventory item

#### Demand Forecast Endpoints
- `GET /api/forecast/demand` - Get all demand forecasts
- `GET /api/forecast/demand/:productId` - Get forecast for specific product

#### Workforce Endpoints
- `GET /api/workforce/shifts` - Get all shifts (optional query param: ?date=YYYY-MM-DD)
- `GET /api/workforce/forecast` - Get hourly forecast (optional query param: ?date=YYYY-MM-DD)
- `POST /api/workforce/shifts` - Create new shift
- `PUT /api/workforce/shifts/:id` - Update shift
- `DELETE /api/workforce/shifts/:id` - Delete shift

#### Pricing Endpoints
- `GET /api/pricing/recommendations` - Get pricing recommendations
- `POST /api/pricing/apply` - Apply price change

#### Placement Endpoints
- `GET /api/placement/recommendations` - Get placement recommendations
- `POST /api/placement/apply` - Apply placement recommendation

#### Loss Prevention Endpoints
- `GET /api/loss-prevention/events` - Get shrinkage events
- `PATCH /api/loss-prevention/events/:id` - Update event status

#### Metrics Endpoints
- `GET /api/metrics/operational` - Get operational metrics

#### AI Agent Endpoints (Optional)
- `POST /api/ai/query` - Query AI agent with database context
- `POST /api/ai/chat` - Chat with AI agent

### Example API Implementation (Node.js/Express)

Here's a basic example of how your API might look:

```javascript
// Example: GET /api/inventory endpoint
app.get('/api/inventory', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
      SELECT 
        ProductId, ProductName, Category, CurrentStock, 
        UnitOfMeasure, ReorderPoint, OptimalStock,
        StockStatus, DaysUntilStockout, RecommendedOrderQuantity,
        Confidence, Reasoning, LastUpdated
      FROM Inventory
    `);
    
    const inventory = result.recordset.map(row => ({
      productId: row.ProductId,
      productName: row.ProductName,
      category: row.Category,
      currentStock: row.CurrentStock,
      unitOfMeasure: row.UnitOfMeasure,
      reorderPoint: row.ReorderPoint,
      optimalStock: row.OptimalStock,
      aiInsights: {
        stockStatus: row.StockStatus,
        daysUntilStockout: row.DaysUntilStockout,
        recommendedOrderQuantity: row.RecommendedOrderQuantity,
        confidence: row.Confidence,
        reasoning: row.Reasoning
      },
      lastUpdated: row.LastUpdated
    }));
    
    res.json(inventory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});
```

### API Authentication

Your API should use API key authentication. The frontend sends the API key in the `x-api-key` header.

---

## Part 3: Frontend Configuration

### Step 1: Configure Azure SQL API

Edit `src/lib/azure-sql-config.ts`:

```typescript
export const AZURE_SQL_CONFIG = {
  // Your deployed REST API endpoint
  apiEndpoint: 'https://your-api-endpoint.azurewebsites.net/api',
  
  // Your API key for authentication
  apiKey: 'YOUR_API_KEY_HERE',
  
  // Connection string (not used directly by frontend, kept for reference)
  connectionString: '',
  
  // Database name
  database: 'StoreAIDB',
  
  // Enable fallback to mock data if API fails
  enableMockFallback: true
}
```

### Step 2: Configure Azure OpenAI (Optional)

Edit `src/lib/azure-ai-config.ts`:

```typescript
export const AZURE_AI_CONFIG = {
  // Your Azure OpenAI endpoint
  endpoint: 'https://your-resource.openai.azure.com',
  
  // Your Azure OpenAI API key
  apiKey: 'YOUR_AZURE_OPENAI_KEY',
  
  // Your deployment name (e.g., 'gpt-4', 'gpt-35-turbo')
  deploymentName: 'gpt-4',
  
  // API version
  apiVersion: '2024-02-15-preview'
}
```

---

## Part 4: Testing the Setup

### Test Database Connection

1. Set `enableMockFallback: false` in `azure-sql-config.ts`
2. Open the browser console
3. Navigate to any view in StoreAI
4. Check for API calls in the Network tab
5. Verify data is loading from your database

### Test AI Chat

1. Configure Azure OpenAI credentials
2. Click "AI Agents Active" button
3. Send a message like "What's our current inventory status?"
4. The AI should respond with data from your database

### Fallback to Mock Data

If you're not ready to configure the database:
- Keep `enableMockFallback: true`
- The app will use mock data and still function fully
- This allows development without database credentials

---

## Part 5: Sample Data

To populate your database with sample data for testing, run this SQL:

```sql
-- Insert sample store
INSERT INTO Stores (StoreId, StoreNumber, Name, Region) 
VALUES ('STORE-001', '4521', 'Downtown Market', 'Northeast');

-- Insert sample inventory
INSERT INTO Inventory (ProductId, ProductName, Category, CurrentStock, UnitOfMeasure, 
                      ReorderPoint, OptimalStock, StockStatus, DaysUntilStockout, 
                      RecommendedOrderQuantity, Confidence, Reasoning)
VALUES 
('PROD-001', 'Organic Milk 1 Gallon', 'Dairy', 45, 'gallon', 50, 120, 
 'low', 4.5, 75, 0.87, 'Low stock: 4.5 days remaining.'),
('PROD-002', 'Fresh Bread - Whole Wheat', 'Bakery', 12, 'loaf', 30, 80, 
 'critical', 1.2, 68, 0.92, 'URGENT: Only 1.2 days of stock remaining.');

-- More sample data available in mock-data.ts
```

---

## Deployment Checklist

- [ ] Azure SQL Database created
- [ ] Database schema deployed
- [ ] Sample data inserted (optional)
- [ ] Firewall rules configured
- [ ] REST API deployed to Azure
- [ ] API endpoints tested with Postman/curl
- [ ] API key generated
- [ ] `azure-sql-config.ts` updated with correct values
- [ ] `azure-ai-config.ts` updated (if using AI chat)
- [ ] Frontend tested with real data
- [ ] Error handling verified

---

## Troubleshooting

### "API not configured" Warning
- Check that `apiEndpoint` and `apiKey` are set correctly
- Ensure the endpoint URL doesn't contain placeholder text

### API Returns 401/403 Errors
- Verify the API key is correct
- Check that the `x-api-key` header is being sent

### Data Not Loading
- Open browser DevTools → Network tab
- Check API responses for errors
- Verify database has data
- Check SQL connection string in your API

### AI Chat Not Working
- Verify Azure OpenAI credentials in `azure-ai-config.ts`
- Check that deployment name matches your Azure resource
- Ensure you have quota available in Azure OpenAI

### CORS Errors
- Add CORS headers to your REST API
- Allow origin from your frontend domain
- Include necessary headers: `Content-Type`, `x-api-key`

---

## Security Best Practices

1. **Never commit credentials** to git
2. Use **Azure Key Vault** for production secrets
3. Enable **Azure AD authentication** for SQL Database
4. Use **Managed Identity** for API → Database connection
5. Implement **rate limiting** on your REST API
6. Use **HTTPS only** for all connections
7. Rotate **API keys** regularly
8. Enable **SQL Auditing** for compliance

---

## Cost Optimization

- Use **Azure SQL Database serverless tier** for development
- Scale up to **provisioned compute** for production
- Enable **auto-pause** for dev databases
- Use **Azure Functions Consumption Plan** for API (pay per request)
- Monitor costs with **Azure Cost Management**

---

## Support

For issues with:
- **StoreAI Frontend**: Check the code in `src/lib/api-service.ts`
- **Azure SQL**: See [Azure SQL Documentation](https://docs.microsoft.com/azure/sql-database/)
- **Azure OpenAI**: See [Azure OpenAI Documentation](https://learn.microsoft.com/azure/ai-services/openai/)
