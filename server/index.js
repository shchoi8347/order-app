require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const port = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// --- API Endpoints ---

// GET /api/menus - 모든 메뉴와 옵션 목록 가져오기
app.get("/api/menus", async (req, res) => {
  try {
    const menusResult = await db.query("SELECT * FROM menus ORDER BY id");
    const optionsResult = await db.query("SELECT * FROM options");
    const menus = menusResult.rows.map((menu) => {
      const menuOptions = optionsResult.rows.filter(
        (option) => option.menu_id === menu.id
      );
      return { ...menu, options: menuOptions };
    });
    res.json(menus);
  } catch (err) {
    console.error("Error fetching menus:", err.stack);
    res.status(500).send("Error fetching menus from database");
  }
});

// GET /api/orders - 모든 주문 목록 가져오기 (관리자용)
app.get("/api/orders", async (req, res) => {
    try {
        const ordersResult = await db.query(`
            SELECT o.id, o.created_at, o.total_price, o.status,
                   json_agg(json_build_object(
                       'name', m.name,
                       'quantity', oi.quantity,
                       'options', oi.options
                   )) as items
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN menus m ON oi.menu_id = m.id
            GROUP BY o.id
            ORDER BY o.created_at ASC
        `);
        res.json(ordersResult.rows);
    } catch (err) {
        console.error("Error fetching orders:", err.stack);
        res.status(500).send("Error fetching orders from database");
    }
});

// GET /api/inventory - 모든 메뉴의 재고 정보 가져오기
app.get("/api/inventory", async (req, res) => {
    try {
        const inventoryResult = await db.query("SELECT id, name, stock FROM menus ORDER BY id");
        res.json(inventoryResult.rows);
    } catch (err) {
        console.error("Error fetching inventory:", err.stack);
        res.status(500).send("Error fetching inventory from database");
    }
});

// POST /api/orders - 새로운 주문 생성
app.post("/api/orders", async (req, res) => {
  const { items, totalPrice } = req.body;
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN'); // Start transaction

    // 1. Insert into orders table
    const orderResult = await client.query(
      'INSERT INTO orders (total_price, status) VALUES ($1, $2) RETURNING id, created_at',
      [totalPrice, '주문 접수']
    );
    const newOrder = orderResult.rows[0];

    // 2. Insert into order_items table and update stock
    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, menu_id, quantity, options) VALUES ($1, $2, $3, $4)',
        [newOrder.id, item.id, item.quantity, JSON.stringify(item.options)]
      );
    }

    await client.query('COMMIT'); // Commit transaction
    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    await client.query('ROLLBACK'); // Rollback transaction on error
    console.error("Error creating order:", err.stack);
    res.status(500).send("Error creating order");
  } finally {
    client.release();
  }
});

// PATCH /api/orders/:orderId - 특정 주문의 상태 변경
app.patch("/api/orders/:orderId", async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Update order status
        const result = await client.query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
            [status, orderId]
        );

        if (result.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).send('Order not found');
        }

        // 2. If status is '제조 완료', update inventory
        if (status === '제조 완료') {
            const itemsResult = await client.query('SELECT * FROM order_items WHERE order_id = $1', [orderId]);
            const orderItems = itemsResult.rows;

            for (const item of orderItems) {
                await client.query(
                    'UPDATE menus SET stock = stock - $1 WHERE id = $2',
                    [item.quantity, item.menu_id]
                );
            }
        }

        await client.query('COMMIT');
        res.json({ success: true, updatedOrder: result.rows[0] });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(`Error updating order ${orderId}:`, err.stack);
        res.status(500).send("Error updating order status");
    } finally {
        client.release();
    }
});

// PATCH /api/inventory/:menuId - 특정 메뉴의 재고 수동 조절
app.patch("/api/inventory/:menuId", async (req, res) => {
    const { menuId } = req.params;
    const { stock } = req.body;
    try {
        const result = await db.query(
            'UPDATE menus SET stock = $1 WHERE id = $2 RETURNING *',
            [stock, menuId]
        );
        if (result.rowCount === 0) {
            return res.status(404).send('Menu item not found');
        }
        res.json({ success: true, updatedItem: result.rows[0] });
    } catch (err) {
        console.error(`Error updating inventory for menu ${menuId}:`, err.stack);
        res.status(500).send("Error updating inventory");
    }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
