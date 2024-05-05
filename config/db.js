const mysql = require("mysql2/promise");
const { MY_DB } = require("./env");

const connection = mysql.createPool({
  host: "127.0.0.1",
  port: "3306",
  user: "root",
  password: "1922",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log("Database connection pool created");

const initializeDB = async () => {
  try {
    // delete database
    // await connection.query(`drop database ${MY_DB}`);

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${MY_DB};`);
    console.log("Database created or successfully checked");
  } catch (error) {
    console.error("Error occurred:", error.message);
  }
};

initializeDB();
module.exports = connection;
