const {
  find,
  findById,
  addOne,
  findOneAndUpdate,
  findByIdAndDelete,
} = require("../models/goalModel");

const getGoals = async (req, res) => {
  try {
    const goals = await find();

    if (!goals || goals.length === 0) {
      // No goals found
      return res.status(404).json({ message: "No goals found" });
    }

    res.json(goals);
  } catch (error) {
    console.error("Error fetching goals:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getGoal = async (req, res) => {
  try {
    const goal = await findById(req.params.id);

    if (goal) {
      // Goal found, send the goal as JSON response
      res.json(goal);
    } else {
      // No goal found with the specified id, send a 404 status code
      res.status(404).json({ message: "Goal not found" });
    }
  } catch (error) {
    // Handle any errors that occurred during the fetch operation
    console.error("Error fetching goal:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addGoal = async (req, res) => {
  try {
    // Validate request body
    if (
      !req.body.title ||
      !req.body.description ||
      !req.body.targetDate ||
      req.body.achieved === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await addOne(req.body);

    if (result && result.goal_id) {
      // Goal added successfully
      res.status(201).json({ message: "New goal added", result });
    } else {
      // Failed to add goal
      res.status(500).json({ message: "Failed to add goal" });
    }
  } catch (error) {
    // Handle any errors that occurred during the add operation
    console.error("Error adding goal:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateGoal = async (req, res) => {
  try {
    // Validate request body
    if (
      !req.body.title ||
      !req.body.description ||
      !req.body.targetDate ||
      req.body.achieved === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await findOneAndUpdate(req.body, req.params.id);

    if (!result) {
      // No goal found with the specified id, send a 404 status code
      return res.status(404).json({ message: "Goal not found" });
    }

    // Goal updated successfully, send the updated goal as JSON response
    res.json({ message: "Goal updated", result });
  } catch (error) {
    // Handle any errors that occurred during the update operation
    console.error("Error updating goal:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const result = await findByIdAndDelete(req.params.id);

    if (!result) {
      // No goal found with the specified id, send a 404 status code
      return res.status(404).json({ message: "Goal not found" });
    }

    // Goal deleted successfully, send a 204 No Content status
    res.status(204).json({ message: "Goal deleted" });
  } catch (error) {
    // Handle any errors that occurred during the delete operation
    console.error("Error deleting goal:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getGoals, getGoal, addGoal, updateGoal, deleteGoal };
