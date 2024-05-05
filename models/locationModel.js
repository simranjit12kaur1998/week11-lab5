const connection = require("../config/db");
const { MY_DB } = require("../config/env");

const locationTable = async () => {
  try {
    // Switch to the created database
    await connection.query(`USE ${MY_DB};`);
    console.log(`Switched to ${MY_DB}`);

    // delete table
    // await connection.query(`drop table cats_table`);

    // Create locations_table table if it doesn't exist
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS locations_table (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      latitude FLOAT NOT NULL,
      longitude FLOAT);
    `;

    await connection.query(createTableSql);
    console.log("locations_table table created or successfully checked");
  } catch (error) {
    console.error("Error occurred:", error.message);
    throw error;
  }
};

// Create table
locationTable();

const find = async () => {
  const sql = connection.format("SELECT * FROM locations_table");

  try {
    const [rows] = await connection.query(sql);
    // Process the rows retrieved from the database
    if (rows.length === 0) {
      // No rows found
      console.log("No locations found");
      return {}; // Return empty JSON object
    }
    return rows;
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error;
  }
};

const findById = async (id) => {

  const sql = connection.format("SELECT * FROM locations_table WHERE id = ?", [id]);

  try {
    const [rows] = await connection.query(sql);
    if (rows.length === 0) {
      // No rows found
      console.log(`No location found with id: ${id}`);
      return false;
    }

    return rows[0];
  } catch (error) {
    console.error("Error fetching location by id:", error);
    throw error;
  }
};


const findByAddr = async (address) => {

  const sql = connection.format("SELECT * FROM locations_table WHERE address = ?", [address]);
  console.log(sql);
  try {
    const [rows] = await connection.query(sql);
    
    if (rows.length === 0) {
      // No rows found
      console.log(`No location found with name: ${address}`);
      return false;
    }

    return rows[0];
  } catch (error) {
    console.error("Error fetching location by address:", error);
    throw error;
  }
};


const addOne = async (location) => {
  try {
    const { name, address, latitude, longitude } = location;

    const sql = connection.format(
      "INSERT INTO locations_table (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
      [name, address, latitude, longitude]
    );
    const [rows] = await connection.query(sql);

    if (rows.affectedRows === 0) {
      return false;
    }

    // Construct the added location object
    const addedLocation = {
      location_id: rows.insertId,
      ...location
    };

    return addedLocation;
  } catch (error) {
    console.error("Error adding location:", error);
    throw error;
  }
};

const findOneAndUpdate = async (location, id) => {
  try {
    let sql = connection.format(`UPDATE locations_table SET ? WHERE id = ?`, [
      location,
      id,
    ]);

    const [rows] = await connection.execute(sql);

    if (rows.affectedRows === 0) {
      // No rows affected by the update operation
      console.log(`No location found with id: ${id}`);
      return false;
    }

    // Construct the updated location object
    const updatedLocation = {
      id,
      ...location,
    };

    return updatedLocation;
  } catch (error) {
    console.error("Error updating location:", error);
    throw error;
  }
};

const findByIdAndDelete = async (id) => {
  try {
    const sql = connection.format("DELETE FROM locations_table WHERE id = ?", [id]);
    const [rows] = await connection.execute(sql);

    if (rows.affectedRows === 0) {
      // No rows affected by the delete operation
      console.log(`No location found with id: ${id}`);
      return false;
    }

    return { message: "Delete succeeded" };
  } catch (error) {
    console.error("Error deleting location:", error);
    throw error;
  }
};

module.exports = {
  find,
  findById,
  findByAddr,
  addOne,
  findOneAndUpdate,
  findByIdAndDelete,
};
