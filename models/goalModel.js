const connection = require("../config/db");
const { MY_DB } = require("../config/env");

const goalTable = async () => {
  try {
    // Switch to the created database
    await connection.query(`USE ${MY_DB};`);
    console.log(`Switched to ${MY_DB}`);

    // delete table
    // await connection.query(`drop table cats_table`);

    // Create goals_table table if it doesn't exist
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS goals_table (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        targetDate DATE,
        achieved BOOLEAN
      );
    `;

    await connection.query(createTableSql);
    console.log("goals_table table created or successfully checked");
  } catch (error) {
    console.error("Error occurred:", error.message);
    throw error;
  }
};

// Create table
goalTable();

const find = async () => {
  const sql = connection.format("SELECT * FROM goals_table");

  try {
    const [rows] = await connection.query(sql);
    // Process the rows retrieved from the database
    if (rows.length === 0) {
      // No rows found
      console.log("No goals found");
      return {}; // Return empty JSON object
    }
    return rows;
  } catch (error) {
    console.error("Error fetching goals:", error);
    throw error;
  }
};

const findById = async (id) => {
  const sql = connection.format("SELECT * FROM goals_table WHERE id = ?", [id]);

  try {
    const [rows] = await connection.query(sql);

    if (rows.length === 0) {
      // No rows found
      console.log(`No goal found with id: ${id}`);
      return false;
    }

    return rows[0];
  } catch (error) {
    console.error("Error fetching goal by id:", error);
    throw error;
  }
};

const addOne = async (goal) => {
  try {
    const { title, description, targetDate, achieved } = goal;

    const sql = connection.format(
      "INSERT INTO goals_table (title, description, targetDate, achieved) VALUES (?, ?, ?, ?)",
      [title, description, targetDate, achieved]
    );
    const [rows] = await connection.query(sql);

    if (rows.affectedRows === 0) {
      return false;
    }

    // Construct the added goal object
    const addedGoal = {
      goal_id: rows.insertId,
      ...goal
    };

    return addedGoal;
  } catch (error) {
    console.error("Error adding goal:", error);
    throw error;
  }
};

const findOneAndUpdate = async (goal, id) => {
  try {
    let sql = connection.format(`UPDATE goals_table SET ? WHERE id = ?`, [
      goal,
      id,
    ]);

    const [rows] = await connection.execute(sql);

    if (rows.affectedRows === 0) {
      // No rows affected by the update operation
      console.log(`No goal found with id: ${id}`);
      return false;
    }

    // Construct the updated goal object
    const updatedGoal = {
      id,
      ...goal,
    };

    return updatedGoal;
  } catch (error) {
    console.error("Error updating goal:", error);
    throw error;
  }
};

const findByIdAndDelete = async (id) => {
  try {
    const sql = connection.format("DELETE FROM goals_table WHERE id = ?", [id]);
    const [rows] = await connection.execute(sql);

    if (rows.affectedRows === 0) {
      // No rows affected by the delete operation
      console.log(`No goal found with id: ${id}`);
      return false;
    }

    return { message: "Delete succeeded" };
  } catch (error) {
    console.error("Error deleting goal:", error);
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
