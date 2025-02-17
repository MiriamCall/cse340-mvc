// import sqlite3 from "sqlite3";
// import { open } from "sqlite";
// import fs from "fs";

// // Immediately Invoked Async Function (IIFE) to initialize the database
// const dbPromise = (async () => {
//   const db = await open({
//     filename: "./src/database/db.sqlite",
//     driver: sqlite3.Database,
//   });

//   // Run the setup SQL file once at startup
//   const sql = fs.readFileSync("./src/database/setup.sql", "utf-8");
//   await db.exec(sql);
//   return db; // Return the database connection for use across the application
// })();

// export default dbPromise;
