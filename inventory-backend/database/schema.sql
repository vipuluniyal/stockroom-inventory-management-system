 -- ============================================================
-- Stockroom Inventory Management — MySQL schema
-- Charset/engine chosen for FK support and full unicode names.
-- ============================================================

CREATE DATABASE IF NOT EXISTS stockroom
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE stockroom;

-- ---------------------------------------------------------
-- Users (auth)
-- ---------------------------------------------------------
CREATE TABLE users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120)      NOT NULL,
  email         VARCHAR(180)      NOT NULL UNIQUE,
  password_hash VARCHAR(255)      NOT NULL,
  role          ENUM('Admin','Manager','Staff') NOT NULL DEFAULT 'Staff',
  created_at    TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Categories
-- ---------------------------------------------------------
CREATE TABLE categories (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255) DEFAULT NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Suppliers
-- ---------------------------------------------------------
CREATE TABLE suppliers (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(150) NOT NULL,
  email      VARCHAR(180) DEFAULT NULL,
  phone      VARCHAR(40)  DEFAULT NULL,
  address    VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Customers
-- ---------------------------------------------------------
CREATE TABLE customers (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(150) NOT NULL,
  email      VARCHAR(180) DEFAULT NULL,
  phone      VARCHAR(40)  DEFAULT NULL,
  address    VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Products
-- category / supplier are stored by id (FK) with the readable
-- name exposed via the API (see ProductController) so the
-- existing frontend, which expects plain "category" and
-- "supplier" strings, keeps working unmodified.
-- ---------------------------------------------------------
CREATE TABLE products (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(150)   NOT NULL,
  sku          VARCHAR(60)    NOT NULL UNIQUE,
  category_id  INT UNSIGNED   DEFAULT NULL,
  supplier_id  INT UNSIGNED   DEFAULT NULL,
  quantity     INT             NOT NULL DEFAULT 0,
  reorder_level INT            NOT NULL DEFAULT 0,
  price        DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  created_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  CONSTRAINT fk_products_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_products_quantity ON products (quantity);

-- ---------------------------------------------------------
-- Purchases (stock coming in) + line items
-- ---------------------------------------------------------
CREATE TABLE purchases (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reference    VARCHAR(40)    NOT NULL UNIQUE,
  supplier_id  INT UNSIGNED   DEFAULT NULL,
  order_date   DATE           NOT NULL,
  items_count  INT UNSIGNED   NOT NULL DEFAULT 0,
  total        DECIMAL(12,2)  NOT NULL DEFAULT 0.00,
  status       ENUM('paid','pending','cancelled') NOT NULL DEFAULT 'pending',
  created_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_purchases_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE purchase_items (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  purchase_id INT UNSIGNED NOT NULL,
  product_id  INT UNSIGNED DEFAULT NULL,
  quantity    INT          NOT NULL DEFAULT 1,
  unit_price  DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  CONSTRAINT fk_purchase_items_purchase FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE,
  CONSTRAINT fk_purchase_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Sales (stock going out) + line items
-- ---------------------------------------------------------
CREATE TABLE sales (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reference    VARCHAR(40)    NOT NULL UNIQUE,
  customer_id  INT UNSIGNED   DEFAULT NULL,
  order_date   DATE           NOT NULL,
  items_count  INT UNSIGNED   NOT NULL DEFAULT 0,
  total        DECIMAL(12,2)  NOT NULL DEFAULT 0.00,
  status       ENUM('paid','pending','cancelled') NOT NULL DEFAULT 'pending',
  created_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sales_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE sale_items (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sale_id    INT UNSIGNED NOT NULL,
  product_id INT UNSIGNED DEFAULT NULL,
  quantity   INT          NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  CONSTRAINT fk_sale_items_sale FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
  CONSTRAINT fk_sale_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Inventory adjustment log (audit trail for +/- stock changes)
-- ---------------------------------------------------------
CREATE TABLE inventory_logs (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id  INT UNSIGNED NOT NULL,
  change_qty  INT          NOT NULL,       -- positive = added, negative = removed
  reason      VARCHAR(255) DEFAULT NULL,
  created_by  INT UNSIGNED DEFAULT NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_inventory_logs_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_inventory_logs_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- Seed data (mirrors the frontend's mock data 1:1)
-- Default password for the seeded admin is "admin123"
-- (hash below is password_hash('admin123', PASSWORD_BCRYPT))
-- ============================================================

INSERT INTO users (name, email, password_hash, role) VALUES
('Vipul Uniyal', 'admin@stockroom.app', '$2b$12$B0FqdQPEbHES03YCB1kgEOSYQaOQytYF4MweWQQU3oHjRRec2tVz2', 'Admin');

INSERT INTO categories (name, description) VALUES
('Hardware', 'Fasteners, tools, and mechanical parts'),
('Electronics', 'Components, cables, and devices'),
('Packaging', 'Boxes, tape, and shipping supplies'),
('Raw Materials', 'Unprocessed stock used in production'),
('Apparel', 'Branded clothing and textiles'),
('Office', 'Office and administrative supplies');

INSERT INTO suppliers (name, email, phone, address) VALUES
('Fastenal Co.', 'orders@fastenal.example', '555-0142', 'Denver, CO'),
('Circuit Supply', 'sales@circuitsupply.example', '555-0198', 'Austin, TX'),
('BoxWorks', 'hello@boxworks.example', '555-0110', 'Portland, OR'),
('MetalSource', 'info@metalsource.example', '555-0177', 'Pittsburgh, PA');

INSERT INTO customers (name, email, phone, address) VALUES
('Northgate Retail', 'buying@northgate.example', '555-0301', 'Seattle, WA'),
('Riverside Manufacturing', 'procure@riverside.example', '555-0322', 'Columbus, OH'),
('Everline Studios', 'orders@everline.example', '555-0355', 'Brooklyn, NY');

INSERT INTO products (name, sku, category_id, supplier_id, quantity, reorder_level, price) VALUES
('Hex Bolt M8x40', 'HW-0812', 1, 1, 1240, 300, 0.18),
('USB-C Cable 1m', 'EL-3301', 2, 2, 86, 150, 3.40),
('Corrugated Box 12x12x12', 'PK-1212', 3, 3, 512, 200, 0.92),
('Aluminum Sheet 2mm', 'RM-2200', 4, 4, 34, 50, 22.50),
('Cotton T-Shirt (M)', 'AP-4402', 5, 1, 420, 100, 4.10),
('A4 Printer Paper (Ream)', 'OF-0090', 6, 3, 12, 40, 5.60),
('Wireless Mouse', 'EL-3305', 2, 2, 210, 80, 9.75),
('Packing Tape Roll', 'PK-1300', 3, 3, 640, 150, 1.15);

INSERT INTO purchases (reference, supplier_id, order_date, items_count, total, status) VALUES
('PO-1001', 1, '2026-07-02', 3, 842.50, 'paid'),
('PO-1002', 2, '2026-07-14', 2, 1290.00, 'pending'),
('PO-1003', 4, '2026-07-21', 1, 610.00, 'pending');

INSERT INTO sales (reference, customer_id, order_date, items_count, total, status) VALUES
('SO-2001', 1, '2026-07-05', 5, 431.20, 'paid'),
('SO-2002', 2, '2026-07-18', 2, 1180.00, 'paid'),
('SO-2003', 3, '2026-07-27', 4, 275.60, 'pending');
