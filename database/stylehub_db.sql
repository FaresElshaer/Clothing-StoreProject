CREATE DATABASE IF NOT EXISTS stylehub_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE stylehub_db;

DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_code VARCHAR(50) NOT NULL UNIQUE,
  customer_name VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(150) NULL,
  customer_address TEXT NOT NULL,
  customer_notes TEXT NULL,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  shipping DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_code VARCHAR(50) NULL,
  discount_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  grand_total DECIMAL(10,2) NOT NULL DEFAULT 0,
  delivery_message VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NULL,
  product_name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  line_total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE
);

INSERT INTO products (id, name, category, price, image) VALUES
(1, 'Classic White T-Shirt', 'Men', 25.00, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop'),
(2, 'Black Hoodie', 'Men', 55.00, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop'),
(3, 'Blue Denim Jacket', 'Men', 75.00, 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?q=80&w=600&auto=format&fit=crop'),
(4, 'Slim Fit Jeans', 'Men', 60.00, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop'),
(5, 'Summer Floral Dress', 'Women', 70.00, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop'),
(6, 'Elegant Blazer', 'Women', 90.00, 'https://images.unsplash.com/photo-1544957992-20514f595d6f?q=80&w=600&auto=format&fit=crop'),
(7, 'Casual Women Shirt', 'Women', 38.00, 'https://images.unsplash.com/photo-1551048632-24e444b48a3e?q=80&w=600&auto=format&fit=crop'),
(8, 'Fashion Skirt', 'Women', 45.00, 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=600&auto=format&fit=crop'),
(9, 'Leather Belt', 'Accessories', 22.00, 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=600&auto=format&fit=crop'),
(10, 'Fashion Sunglasses', 'Accessories', 35.00, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop'),
(11, 'Stylish Cap', 'Accessories', 20.00, 'https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=600&auto=format&fit=crop'),
(12, 'Black Handbag', 'Accessories', 65.00, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop');
