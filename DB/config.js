const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verificar la conexión
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database: ', err.stack);
    process.exit(1);
  }
  console.log('Connected to the database as id ' + connection.threadId);
  connection.release(); // Liberar la conexión
});

module.exports = pool;