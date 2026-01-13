-- Drop all foreign key constraints dynamically
DECLARE @sql NVARCHAR(MAX) = '';
SELECT @sql = @sql + 'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id)) + '.' + QUOTENAME(OBJECT_NAME(parent_object_id)) + 
    ' DROP CONSTRAINT ' + QUOTENAME(name) + ';'
FROM sys.foreign_keys
WHERE OBJECT_NAME(referenced_object_id) IN ('customers', 'inventory', 'orders', 'stock', 'returns')
   OR OBJECT_NAME(parent_object_id) IN ('customers', 'inventory', 'orders', 'stock', 'returns');
EXEC sp_executesql @sql;
GO

-- Drop tables in correct order
IF OBJECT_ID('dbo.returns', 'U') IS NOT NULL DROP TABLE dbo.returns;
IF OBJECT_ID('dbo.stock', 'U') IS NOT NULL DROP TABLE dbo.stock;
IF OBJECT_ID('dbo.orders', 'U') IS NOT NULL DROP TABLE dbo.orders;
IF OBJECT_ID('dbo.inventory', 'U') IS NOT NULL DROP TABLE dbo.inventory;
IF OBJECT_ID('dbo.customers', 'U') IS NOT NULL DROP TABLE dbo.customers;
GO

-- Customers Table
CREATE TABLE customers (
    customer_id INT PRIMARY KEY IDENTITY(1,1),
    first_name NVARCHAR(50) NOT NULL,
    last_name NVARCHAR(50) NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    phone NVARCHAR(20),
    address NVARCHAR(200),
    city NVARCHAR(50),
    state NVARCHAR(2),
    zip_code NVARCHAR(10),
    loyalty_points INT DEFAULT 0,
    created_date DATETIME DEFAULT GETDATE()
);
GO

-- Inventory Table
CREATE TABLE inventory (
    inventory_id INT PRIMARY KEY IDENTITY(1,1),
    product_name NVARCHAR(100) NOT NULL,
    product_description NVARCHAR(500),
    category NVARCHAR(50),
    unit_price DECIMAL(10,2) NOT NULL,
    supplier_id INT,
    sku NVARCHAR(50) UNIQUE,
    created_date DATETIME DEFAULT GETDATE(),
    updated_date DATETIME DEFAULT GETDATE()
);
GO

-- Orders Table
CREATE TABLE orders (
    order_id INT PRIMARY KEY IDENTITY(1,1),
    customer_id INT NOT NULL,
    order_date DATETIME DEFAULT GETDATE(),
    total_amount DECIMAL(10,2) NOT NULL,
    status NVARCHAR(20) DEFAULT 'pending',
    payment_method NVARCHAR(50),
    created_date DATETIME DEFAULT GETDATE()
);
GO

-- Stock Table
CREATE TABLE stock (
    stock_id INT PRIMARY KEY IDENTITY(1,1),
    inventory_id INT NOT NULL,
    quantity_on_hand INT NOT NULL DEFAULT 0,
    reorder_level INT DEFAULT 10,
    warehouse_location NVARCHAR(50),
    last_updated DATETIME DEFAULT GETDATE()
);
GO

-- Returns Table
CREATE TABLE returns (
    return_id INT PRIMARY KEY IDENTITY(1,1),
    order_id INT NOT NULL,
    inventory_id INT NOT NULL,
    return_date DATETIME DEFAULT GETDATE(),
    quantity_returned INT NOT NULL,
    reason NVARCHAR(200),
    refund_amount DECIMAL(10,2),
    status NVARCHAR(20) DEFAULT 'pending'
);
