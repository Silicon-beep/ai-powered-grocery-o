-- ======================================
-- SCHEMA FOR CUSTOMER LOYALTY IN GROCERY
-- Supports:
--  - Customer management with loyalty levels
--  - Product master, prices with history
--  - Store product locations
--  - Order history, returns, and product replacements
-- ======================================

-- === CUSTOMERS (Loyalty Membership) ===
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(20),
    LoyaltyLevel VARCHAR(20) DEFAULT 'Bronze'
);

-- === PRODUCTS MASTER ===
CREATE TABLE Products (
    ProductID INT PRIMARY KEY AUTO_INCREMENT,
    ProductName VARCHAR(100) NOT NULL,
    Category VARCHAR(50)
);

-- === PRODUCTS PRICE HISTORY ===
CREATE TABLE ProductPrices (
    PriceID INT PRIMARY KEY AUTO_INCREMENT,
    ProductID INT NOT NULL,
    Price DECIMAL(8,2) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

-- === PRODUCT LOCATIONS (per store, if needed) ===
CREATE TABLE ProductLocations (
    LocationID INT PRIMARY KEY AUTO_INCREMENT,
    ProductID INT NOT NULL,
    StoreID INT DEFAULT 1, -- for chains, expand as needed
    Aisle VARCHAR(20),
    Shelf VARCHAR(20),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

-- === ORDERS ===
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY AUTO_INCREMENT,
    CustomerID INT NOT NULL,
    OrderDate DATE NOT NULL,
    Status VARCHAR(20) DEFAULT 'Placed', -- 'Placed', 'Returned'
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

-- === ORDER ITEMS ===
CREATE TABLE OrderItems (
    OrderItemID INT PRIMARY KEY AUTO_INCREMENT,
    OrderID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    PriceAtPurchase DECIMAL(8,2) NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

-- === PRODUCT REPLACEMENTS FOR RETURNS ===
CREATE TABLE ProductReplacements (
    ReplacementID INT PRIMARY KEY AUTO_INCREMENT,
    OriginalOrderItemID INT NOT NULL,       -- the returned order item
    ReplacementProductID INT NOT NULL,      -- product offered as replacement
    ReplacementOrderItemID INT,             -- the chosen replacement item (nullable if declined)
    Reason VARCHAR(255),                    -- (optional) reason for replacement
    ReplacementDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (OriginalOrderItemID) REFERENCES OrderItems(OrderItemID),
    FOREIGN KEY (ReplacementProductID) REFERENCES Products(ProductID),
    FOREIGN KEY (ReplacementOrderItemID) REFERENCES OrderItems(OrderItemID)
);

-- ======================================
-- SAMPLE DATA
-- ======================================

-- Add Customers
INSERT INTO Customers (Name, Email, Phone, LoyaltyLevel) VALUES
('Alice Smith', 'alice.smith@email.com', '555-1111', 'Gold'),
('Bob Johnson', 'bob.johnson@email.com', '555-2222', 'Silver'),
('Charlie Lee', 'charlie.lee@email.com', '555-3333', 'Platinum'),
('Dana White', 'dana.white@email.com', '555-4444', 'Bronze'),
('Frank White', 'frank@email.com', '555-5555', 'Gold');

-- Add Products
INSERT INTO Products (ProductName, Category) VALUES
('Gala Apples', 'Produce'),
('Whole Milk', 'Dairy'),
('Sourdough Bread', 'Bakery'),
('Eggs Grade A', 'Dairy'),
('Chicken Breast', 'Meat'),
('Orange Juice', 'Beverages'),
('Bananas', 'Produce'),
('Whole Wheat Bread', 'Bakery');

-- Product Price History
INSERT INTO ProductPrices (ProductID, Price, StartDate, EndDate) VALUES
(1, 1.99, '2026-01-01', NULL), -- Gala Apples
(2, 2.99, '2026-01-01', NULL), -- Whole Milk
(3, 3.49, '2025-01-01', '2025-11-30'), -- Sourdough Bread
(3, 3.79, '2025-12-01', NULL),
(4, 2.49, '2026-01-01', NULL), -- Eggs
(5, 5.99, '2026-01-01', NULL), -- Chicken Breast
(6, 3.69, '2026-01-01', NULL), -- Orange Juice
(7, 0.59, '2025-01-01', '2025-06-30'), -- Bananas
(7, 0.65, '2025-07-01', NULL),
(8, 2.99, '2026-01-01', NULL); -- Whole Wheat Bread

-- Product Locations
INSERT INTO ProductLocations (ProductID, Aisle, Shelf) VALUES
(1, 'Aisle 1', 'Shelf A'),
(2, 'Aisle 2', 'Shelf C'),
(3, 'Aisle 4', 'Shelf B'),
(4, 'Aisle 2', 'Shelf B'),
(5, 'Aisle 6', 'Shelf A'),
(6, 'Aisle 3', 'Shelf D'),
(7, 'Aisle 1', 'Shelf A'),
(8, 'Aisle 4', 'Shelf C');

-- Orders and Items
INSERT INTO Orders (CustomerID, OrderDate, Status) VALUES
(1, '2025-12-01', 'Placed'),
(1, '2026-01-10', 'Placed'),
(2, '2025-12-03', 'Placed'),
(3, '2025-12-15', 'Placed'),
(4, '2026-01-07', 'Placed'),
(5, '2026-01-09', 'Returned');

INSERT INTO OrderItems (OrderID, ProductID, Quantity, PriceAtPurchase) VALUES
(1, 1, 6, 1.99),         -- Gala Apples
(1, 2, 2, 2.99),         -- Whole Milk
(2, 3, 2, 3.79),         -- Sourdough Bread (price at that time)
(2, 1, 3, 1.99),         -- Gala Apples
(3, 5, 1, 5.99),         -- Chicken Breast
(3, 6, 3, 3.69),         -- Orange Juice
(4, 6, 2, 3.69),         -- Orange Juice
(4, 2, 1, 2.99),         -- Whole Milk
(5, 4, 1, 2.49),         -- Eggs
(6, 8, 1, 2.99);         -- Whole Wheat Bread

-- Example ProductReplacement (tracking that Sourdough Bread was replaced with Whole Wheat Bread on a return)
-- Suppose OrderItem 5 is the returned item (OrderID 2, Sourdough Bread)
-- We offer Whole Wheat Bread (Product 8) and it is accepted/recorded as OrderItem 10.
INSERT INTO ProductReplacements (OriginalOrderItemID, ReplacementProductID, ReplacementOrderItemID, Reason)
VALUES (5, 8, 10, 'Similar category and price');

-- ======================================
-- USEFUL AGENT QUERIES
-- ======================================

-- 1. Add new customer:
-- INSERT INTO Customers (Name, Email, Phone, LoyaltyLevel) VALUES (?, ?, ?, ?);

-- 2. Show customer's order history:
-- SELECT o.OrderID, o.OrderDate, o.Status, oi.ProductID, p.ProductName, oi.Quantity, oi.PriceAtPurchase
-- FROM Orders o
-- JOIN OrderItems oi ON o.OrderID = oi.OrderID
-- JOIN Products p ON oi.ProductID = p.ProductID
-- WHERE o.CustomerID = ? ORDER BY o.OrderDate DESC;

-- 3. Return an order (set status):
-- UPDATE Orders SET Status = 'Returned' WHERE OrderID = ?;

-- 4. Show product price history:
-- SELECT Price, StartDate, EndDate FROM ProductPrices WHERE ProductID = ? ORDER BY StartDate DESC;

-- 5. Show product location in store:
-- SELECT Aisle, Shelf FROM ProductLocations WHERE ProductID = ?;

-- 6. Find similar replacement products for a returned product
-- (same category, price within 15% of returned item's price)
-- :productId = returned item ProductID, :price = item's purchase price
-- (adjust price range as needed)
-- SELECT p.ProductID, p.ProductName, pr.Price
-- FROM Products p
-- JOIN ProductPrices pr ON p.ProductID = pr.ProductID
-- WHERE p.Category = (SELECT Category FROM Products WHERE ProductID = :productId)
--   AND pr.EndDate IS NULL
--   AND pr.Price BETWEEN (:price * 0.85) AND (:price * 1.15)
--   AND p.ProductID != :productId;

-- 7. Log a replacement or declined replacement:
-- Accepted:
--   INSERT INTO ProductReplacements (OriginalOrderItemID, ReplacementProductID, ReplacementOrderItemID, Reason)
--   VALUES (?, ?, ?, ?);
-- Declined:
--   INSERT INTO ProductReplacements (OriginalOrderItemID, ReplacementProductID, Reason)
--   VALUES (?, ?, ?);