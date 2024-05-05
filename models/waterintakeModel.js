const connection = require("../config/db");
const { MY_DB } = require("../config/env");

const waterintakeTable = async () => {
  try {
    // Switch to the created database
    await connection.query(`USE ${MY_DB};`);
    console.log(`Switched to ${MY_DB}`);

    // delete table
    // await connection.query(`drop table cats_table`);

    // Create waterintakes_table table if it doesn't exist
    const createTableSql = `
    CREATE TABLE IF NOT EXISTS waterintakes_table (
      id INT AUTO_INCREMENT PRIMARY KEY,
      date DATE NOT NULL,
      amountInLiters FLOAT NOT NULL,
      comments TEXT NOT NULL
    );
    `;

    await connection.query(createTableSql);
    console.log("waterintakes_table table created or successfully checked");

    
  } catch (error) {
    console.error("Error occurred:", error.message);
    throw error;
  }
};

// Create table
waterintakeTable();

const find = async () => {
  const sql = connection.format("SELECT * FROM waterintakes_table");

  try {
    const [rows] = await connection.query(sql);
    // Process the rows retrieved from the database
    if (rows.length === 0) {
      // No rows found
      console.log("No waterintakes found");
      return {}; // Return empty JSON object
    }
    return rows;
  } catch (error) {
    console.error("Error fetching waterintakes:", error);
    throw error;
  }
};

const findById = async (id) => {
  const sql = connection.format("SELECT * FROM waterintakes_table WHERE id = ?", [id]);

  try {
    const [rows] = await connection.query(sql);

    if (rows.length === 0) {
      // No rows found
      console.log(`No waterintake found with id: ${id}`);
      return false;
    }

    return rows[0];
  } catch (error) {
    console.error("Error fetching waterintake by id:", error);
    throw error;
  }
};

const addOne = async (waterintake) => {
  try {
    const { title, description, targetDate, achieved } = waterintake;

    const sql = connection.format(
      "INSERT INTO waterintakes_table (title, description, targetDate, achieved) VALUES (?, ?, ?, ?)",
      [title, description, targetDate, achieved]
    );
    const [rows] = await connection.query(sql);

    if (rows.affectedRows === 0) {
      return false;
    }

    // Construct the added waterintake object
    const addedWaterintake = {
      waterintake_id: rows.insertId,
      ...waterintake
    };

    return addedWaterintake;
  } catch (error) {
    console.error("Error adding waterintake:", error);
    throw error;
  }
};

const findOneAndUpdate = async (waterintake, id) => {
  try {
    let sql = connection.format(`UPDATE waterintakes_table SET ? WHERE id = ?`, [
      waterintake,
      id,
    ]);

    const [rows] = await connection.execute(sql);

    if (rows.affectedRows === 0) {
      // No rows affected by the update operation
      console.log(`No waterintake found with id: ${id}`);
      return false;
    }

    // Construct the updated waterintake object
    const updatedWaterintake = {
      id,
      ...waterintake,
    };

    return updatedWaterintake;
  } catch (error) {
    console.error("Error updating waterintake:", error);
    throw error;
  }
};

const findByIdAndDelete = async (id) => {
  try {
    const sql = connection.format("DELETE FROM waterintakes_table WHERE id = ?", [id]);
    const [rows] = await connection.execute(sql);

    if (rows.affectedRows === 0) {
      // No rows affected by the delete operation
      console.log(`No waterintake found with id: ${id}`);
      return false;
    }

    return { message: "Delete succeeded" };
  } catch (error) {
    console.error("Error deleting waterintake:", error);
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
