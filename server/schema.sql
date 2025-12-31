-- PostgreSQL Schema for Coffee Order App

-- Menus Table: Stores information about each coffee menu item.
CREATE TABLE menus (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    image_url VARCHAR(255),
    stock INTEGER NOT NULL DEFAULT 0
);

-- Options Table: Stores customization options for menus.
CREATE TABLE options (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL DEFAULT 0,
    menu_id INTEGER REFERENCES menus(id) ON DELETE CASCADE
);

-- Orders Table: Stores information for each order placed.
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_price INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT '주문 접수'
);

-- Order_Items Table: Stores individual items within an order.
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    menu_id INTEGER REFERENCES menus(id),
    quantity INTEGER NOT NULL,
    options JSONB -- Using JSONB to store selected options, e.g., [{"name": "샷 추가", "price": 500}]
);

-- Note: You can run this script in your PostgreSQL client (like pgAdmin's Query Tool)
-- to create all the necessary tables in your 'coffee_order_db' database.

