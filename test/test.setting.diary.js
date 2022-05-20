const { pool } = require("../models/db.js");

async function setTest() {
    try {
      console.log(4);
      const connection = await pool.getConnection(async (conn) => conn);
      console.log(`##### Connection_pool_GET #####`);
      try {
        const setTestQuery = "alter table diary auto_increment = 5";
        await connection.query(setTestQuery);
        console.log("Test Setting is Successfully done!");
        connection.release();
        process.exit(1);
      } catch {
        console.error(`##### Query error ##### `);
        connection.release();
        return false;
      }
    } catch {
      console.error(`##### DB error #####`);
      return false;
    }
  }
  
  setTest();