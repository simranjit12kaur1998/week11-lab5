const {
  find,
  findById,
  addOne,
  findOneAndUpdate,
  findByIdAndDelete,
} = require("../models/catModel");

const getCats = async (req, res) => {
  try {
    const cats = await find();

    if (!cats || cats.length === 0) {
      // No cats found
      return res.status(404).json({ message: "No cats found" });
    }

    res.json(cats);
  } catch (error) {
    console.error("Error fetching cats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCat = async (req, res) => {
  try {
    const cat = await findById(req.params.id);

    if (cat) {
      // Cat found, send the cat as JSON response
      res.json(cat);
    } else {
      // No cat found with the specified id, send a 404 status code
      res.status(404).json({ message: "Cat not found" });
    }
  } catch (error) {
    // Handle any errors that occurred during the fetch operation
    console.error("Error fetching cat:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addCat = async (req, res) => {
  try {
    // Validate request body
    if (
      !req.body.cat_name ||
      !req.body.weight ||
      !req.body.filename ||
      !req.body.birthdate
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await addOne(req.body);

    if (result && result.cat_id) {
      // Cat added successfully
      res.status(201).json({ message: "New cat added", result });
    } else {
      // Failed to add cat
      res.status(500).json({ message: "Failed to add cat" });
    }
  } catch (error) {
    // Handle any errors that occurred during the add operation
    console.error("Error adding cat:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateCat = async (req, res) => {
  try {
    // Validate request body
    if (
      !req.body.cat_name ||
      !req.body.weight ||
      !req.body.filename ||
      !req.body.birthdate
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await findOneAndUpdate(req.body, req.params.id);

    if (!result) {
      // No cat found with the specified id, send a 404 status code
      return res.status(404).json({ message: "Cat not found" });
    }

    // Cat updated successfully, send the updated cat as JSON response
    res.json({ message: "Cat updated", result });
  } catch (error) {
    // Handle any errors that occurred during the update operation
    console.error("Error updating cat:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteCat = async (req, res) => {
  try {
    const result = await findByIdAndDelete(req.params.id);

    if (!result) {
      // No cat found with the specified id, send a 404 status code
      return res.status(404).json({ message: "Cat not found" });
    }

    // Cat deleted successfully, send a 204 No Content status
    res.status(204).json({ message: "Cat deleted" });
  } catch (error) {
    // Handle any errors that occurred during the delete operation
    console.error("Error deleting cat:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getCats,
  getCat,
  addCat,
  updateCat,
  deleteCat,
};
