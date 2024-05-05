const connection = require("../config/db");
const { MY_DB } = require("../config/env");

const catTable = async () => {
  try {
    // Switch to the created database
    await connection.query(`USE ${MY_DB};`);
    console.log(`Switched to ${MY_DB}`);

    // Create cats_table table if it doesn't exist
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS cats_table (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cat_name TEXT NOT NULL,
        weight FLOAT NOT NULL,
        filename TEXT NOT NULL,
        birthdate DATE DEFAULT NULL
      );
    `;

    await connection.query(createTableSql);
    console.log("cats_table table created or successfully checked");
  } catch (error) {
    console.error("Error occurred:", error.message);
    throw error;
  }
};

// Create table
catTable();

const find = async () => {
  try {
    const sql = connection.format("SELECT * FROM cats_table");
    const [rows] = await connection.query(sql);

    if (rows.length === 0) {
      console.log("No cats found");
      return {};
    }

    return rows;
  } catch (error) {
    console.error("Error fetching cats:", error);
    throw error;
  }
};

const findById = async (id) => {
  try {
    const sql = connection.format("SELECT * FROM cats_table WHERE id = ?", [
      id,
    ]);
    const [rows] = await connection.query(sql);

    if (rows.length === 0) {
      console.log(`No cat found with id: ${id}`);
      return false;
    }

    return rows[0];
  } catch (error) {
    console.error("Error fetching cat by id:", error);
    throw error;
  }
};

const addOne = async (cat) => {
  try {
    const { cat_name, weight, filename, birthdate } = cat;

    // Validate required fields
    // if (!cat_name || !weight || !filename) {
    //   throw new Error("Missing required fields");
    // }

    const sql = connection.format(
      "INSERT INTO cats_table (cat_name, weight, filename, birthdate) VALUES (?, ?, ?, ?)",
      [cat_name, weight, filename, birthdate]
    );

    const [rows] = await connection.query(sql);

    if (rows.affectedRows === 0) {
      return false;
    }

    const addedCat = {
      cat_id: rows.insertId,
      ...cat,
    };

    return addedCat;
  } catch (error) {
    console.error("Error adding cat:", error);
    throw error;
  }
};

const findOneAndUpdate = async (cat, id) => {
  try {
    const { cat_name, weight, filename, birthdate } = cat;

    // Validate required fields
    // if (!cat_name || !weight || !filename) {
    //   throw new Error("Missing required fields");
    // }

    const sql = connection.format(
      "UPDATE cats_table SET cat_name = ?, weight = ?, filename = ?, birthdate = ? WHERE id = ?",
      [cat_name, weight, filename, birthdate, id]
    );

    const [rows] = await connection.execute(sql);

    if (rows.affectedRows === 0) {
      console.log(`No cat found with id: ${id}`);
      return false;
    }

    const updatedCat = {
      id,
      ...cat,
    };

    return updatedCat;
  } catch (error) {
    console.error("Error updating cat:", error);
    throw error;
  }
};

const findByIdAndDelete = async (id) => {
  try {
    const sql = connection.format("DELETE FROM cats_table WHERE id = ?", [id]);
    const [rows] = await connection.execute(sql);

    if (rows.affectedRows === 0) {
      console.log(`No cat found with id: ${id}`);
      return false;
    }

    return { message: "Delete succeeded" };
  } catch (error) {
    console.error("Error deleting cat:", error);
    throw error;
  }
};

module.exports = {
  find,
  findById,
  addOne,
  findOneAndUpdate,
  findByIdAndDelete,
};
