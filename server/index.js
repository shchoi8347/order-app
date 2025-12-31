require("dotenv").config();
const express = require("express");
const db = require("./db"); // 데이터베이스 연결 모듈 가져오기

const app = express();
const port = 3001; // 프런트엔드와 다른 포트 사용

app.use(express.json()); // Middleware to parse JSON bodies

// API to get all menus with their options
app.get("/api/menus", async (req, res) => {
  try {
    const menusResult = await db.query("SELECT * FROM menus ORDER BY id");
    const optionsResult = await db.query("SELECT * FROM options");

    // Combine menus with their respective options
    const menus = menusResult.rows.map((menu) => {
      const menuOptions = optionsResult.rows.filter(
        (option) => option.menu_id === menu.id
      );
      return {
        ...menu,
        options: menuOptions,
      };
    });

    res.json(menus);
  } catch (err) {
    console.error("Error fetching menus:", err.stack);
    res.status(500).send("Error fetching menus from database");
  }
});

app.get("/", async (req, res) => {
  try {
    // 데이터베이스 연결 테스트를 위한 쿼리
    const data = await db.query("SELECT NOW()");
    res.send(`Hello World! DB connected. Current time is: ${data.rows[0].now}`);
  } catch (err) {
    console.error("Database connection failed:", err.stack);
    res.status(500).send(`Database connection error: ${err.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
