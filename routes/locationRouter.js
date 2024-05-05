// router.js
const express = require("express");
const router = express.Router();
// controller functions
const locationController = require("../controllers/locationController");


router.get("/", locationController.getLocations);
router.post("/", locationController.addLocation);
router.get("/:id", locationController.getLocation);
router.get("/:address", locationController.getLocationByAddr);
router.delete("/:id", locationController.deleteLocation);
router.put("/:id", locationController.updateLocation);

module.exports = router;