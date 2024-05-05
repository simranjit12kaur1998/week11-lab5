const {
  find,
  findById,
  addOne,
  findOneAndUpdate,
  findByIdAndDelete,
  findByAddr,
} = require("../models/locationModel");

const getLocations = async (req, res) => {
  try {
    const locations = await find();

    if (!locations || locations.length === 0) {
      // No locations found
      return res.status(404).json({ message: "No locations found" });
    }

    res.json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getLocation = async (req, res) => {
  try {
    console.log(req.params.id);
    const location = await findById(req.params.id);

    if (location) {
      // Location found, send the location as JSON response
      res.json(location);
    } else {
      // No location found with the specified id, send a 404 status code
      res.status(404).json({ message: "Location not found" });
    }
  } catch (error) {
    // Handle any errors that occurred during the fetch operation
    console.error("Error fetching location:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const getLocationByAddr = async (req, res) => {
  try {
    console.log(req.params.address);
    const location = await findByAddr(req.params.address);

    if (location) {
      // Location found, send the location as JSON response
      res.json(location);
    } else {
      // No location found with the specified id, send a 404 status code
      res.status(404).json({ message: "Location not found" });
    }
  } catch (error) {
    // Handle any errors that occurred during the fetch operation
    console.error("Error fetching location:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addLocation = async (req, res) => {
  try {
    // Validate request body
    if (
      !req.body.name ||
      !req.body.address ||
      !req.body.latitude ||
      !req.body.longitude 
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await addOne(req.body);

    if (result && result.location_id) {
      // Location added successfully
      res.status(201).json({ message: "New location added", result });
    } else {
      // Failed to add location
      res.status(500).json({ message: "Failed to add location" });
    }
  } catch (error) {
    // Handle any errors that occurred during the add operation
    console.error("Error adding location:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateLocation = async (req, res) => {
  try {
    // Validate request body
    if (
      !req.body.name ||
      !req.body.address ||
      !req.body.latitude ||
      !req.body.longitude 
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await findOneAndUpdate(req.body, req.params.id);

    if (!result) {
      // No location found with the specified id, send a 404 status code
      return res.status(404).json({ message: "Location not found" });
    }

    // Location updated successfully, send the updated location as JSON response
    res.json({ message: "Location updated", result });
  } catch (error) {
    // Handle any errors that occurred during the update operation
    console.error("Error updating location:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteLocation = async (req, res) => {
  try {
    const result = await findByIdAndDelete(req.params.id);

    if (!result) {
      // No location found with the specified id, send a 404 status code
      return res.status(404).json({ message: "Location not found" });
    }

    // Location deleted successfully, send a 204 No Content status
    res.status(204).json({ message: "Location deleted" });
  } catch (error) {
    // Handle any errors that occurred during the delete operation
    console.error("Error deleting location:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getLocations, getLocation, getLocationByAddr,addLocation, updateLocation, deleteLocation };
