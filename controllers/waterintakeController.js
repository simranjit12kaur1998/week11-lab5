const {
  find,
  findById,
  addOne,
  findOneAndUpdate,
  findByIdAndDelete,
} = require("../models/waterintakeModel");

const getWaterintakes = async (req, res) => {
  try {
    const waterintakes = await find();

    if (!waterintakes || waterintakes.length === 0) {
      // No waterintakes found
      return res.status(404).json({ message: "No waterintakes found" });
    }

    res.json(waterintakes);
  } catch (error) {
    console.error("Error fetching waterintakes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getWaterintake = async (req, res) => {
  try {
    const waterintake = await findById(req.params.id);

    if (waterintake) {
      // Waterintake found, send the waterintake as JSON response
      res.json(waterintake);
    } else {
      // No waterintake found with the specified id, send a 404 status code
      res.status(404).json({ message: "Waterintake not found" });
    }
  } catch (error) {
    // Handle any errors that occurred during the fetch operation
    console.error("Error fetching waterintake:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addWaterintake = async (req, res) => {
  try {
    // Validate request body
    if (
      !req.body.date ||
      !req.body.amountInLiters  ||
      !req.body.comments 
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await addOne(req.body);

    if (result && result.waterintake_id) {
      // Waterintake added successfully
      res.status(201).json({ message: "New waterintake added", result });
    } else {
      // Failed to add waterintake
      res.status(500).json({ message: "Failed to add waterintake" });
    }
  } catch (error) {
    // Handle any errors that occurred during the add operation
    console.error("Error adding waterintake:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateWaterintake = async (req, res) => {
  try {
    // Validate request body
    if (
      !req.body.date ||
      !req.body.amountInLiters  ||
      !req.body.comments 
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await findOneAndUpdate(req.body, req.params.id);

    if (!result) {
      // No waterintake found with the specified id, send a 404 status code
      return res.status(404).json({ message: "Waterintake not found" });
    }

    // Waterintake updated successfully, send the updated waterintake as JSON response
    res.json({ message: "Waterintake updated", result });
  } catch (error) {
    // Handle any errors that occurred during the update operation
    console.error("Error updating waterintake:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteWaterintake = async (req, res) => {
  try {
    const result = await findByIdAndDelete(req.params.id);

    if (!result) {
      // No waterintake found with the specified id, send a 404 status code
      return res.status(404).json({ message: "Waterintake not found" });
    }

    // Waterintake deleted successfully, send a 204 No Content status
    res.status(204).json({ message: "Waterintake deleted" });
  } catch (error) {
    // Handle any errors that occurred during the delete operation
    console.error("Error deleting waterintake:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getWaterintakes, getWaterintake, addWaterintake, updateWaterintake, deleteWaterintake };
