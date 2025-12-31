-- PostgreSQL Seed Data for Coffee Order App

-- Clear existing data to avoid duplicates during re-seeding
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM options;
DELETE FROM menus;

-- Reset sequences to start IDs from 1 again
ALTER SEQUENCE menus_id_seq RESTART WITH 1;
ALTER SEQUENCE options_id_seq RESTART WITH 1;
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
ALTER SEQUENCE order_items_id_seq RESTART WITH 1;


-- Insert Sample Menus
INSERT INTO menus (name, description, price, image_url, stock) VALUES
('아메리카노 (ICE)', '시원하고 깔끔한 맛의 에스프레소 커피', 4000, '/americano-ice.jpg', 100),
('카페라떼 (HOT)', '따뜻한 우유와 에스프레소의 부드러운 조화', 5000, '/caffe-latte.jpg', 100),
('바닐라 라떼 (ICE)', '달콤한 바닐라 시럽이 더해진 시원한 라떼', 5500, '/caffe-latte.jpg', 50),
('카라멜 마끼아또', '카라멜 소스와 우유 거품이 어우러진 달콤한 커피', 5800, '/caffe-latte.jpg', 40),
('자몽 허니 블랙티', '자몽의 상큼함과 꿀의 달콤함이 담긴 블랙티', 6000, '/americano-hot.jpg', 30);

-- Insert Sample Options
-- Options for 아메리카노 (ICE) (menu_id: 1)
INSERT INTO options (name, price, menu_id) VALUES
('샷 추가', 500, 1),
('시럽 추가', 0, 1);

-- Options for 카페라떼 (HOT) (menu_id: 2)
INSERT INTO options (name, price, menu_id) VALUES
('샷 추가', 500, 2),
('두유로 변경', 300, 2);

-- Options for 바닐라 라떼 (ICE) (menu_id: 3)
INSERT INTO options (name, price, menu_id) VALUES
('샷 추가', 500, 3),
('휘핑 크림 추가', 500, 3);

-- Options for 카라멜 마끼아또 (menu_id: 4)
INSERT INTO options (name, price, menu_id) VALUES
('샷 추가', 500, 4),
('드리즐 추가', 300, 4);

-- Options for 자몽 허니 블랙티 (menu_id: 5) - No extra options for this example
-- No inserts for menu_id 5

-- Note: You can run this script in your PostgreSQL client (like pgAdmin's Query Tool)
-- to populate your database with initial data.

