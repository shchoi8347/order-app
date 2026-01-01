const fs = require("fs").promises;
const path = require("path");
// .env 파일의 정확한 경로를 명시적으로 지정합니다.
require("dotenv").config({ path: path.join(__dirname, ".env") });
const { pool } = require("./db");

async function setupDatabase() {
  let client;
  try {
    client = await pool.connect();
    console.log("Render 데이터베이스에 성공적으로 연결되었습니다.");

    console.log("\n1. server/schema.sql 파일 읽는 중...");
    const schemaSql = await fs.readFile(
      path.join(__dirname, "schema.sql"),
      "utf-8"
    );
    console.log("2. 테이블 생성 시작...");
    await client.query(schemaSql);
    console.log("✅ 테이블이 성공적으로 생성되었습니다.");

    console.log("\n3. server/seed.sql 파일 읽는 중...");
    const seedSql = await fs.readFile(
      path.join(__dirname, "seed.sql"),
      "utf-8"
    );
    console.log("4. 초기 데이터 삽입 시작...");
    await client.query(seedSql);
    console.log("✅ 초기 데이터가 성공적으로 삽입되었습니다.");

    console.log("\n🚀 Render 데이터베이스 설정이 성공적으로 완료되었습니다!");
  } catch (error) {
    console.error("\n❌ 데이터베이스 설정 중 오류가 발생했습니다:");
    console.error(error);
  } finally {
    if (client) {
      console.log("\n데이터베이스 연결을 종료합니다.");
      await client.release();
    }
    await pool.end();
  }
}

setupDatabase();
