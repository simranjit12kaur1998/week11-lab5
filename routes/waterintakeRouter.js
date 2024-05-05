// router.js
const express = require("express");
const router = express.Router();
// controller functions
const waterintakeController = require("../controllers/waterintakeController");


router.get("/", waterintakeController.getWaterintakes);
router.post("/", waterintakeController.addWaterintake);
router.get("/:id", waterintakeController.getWaterintake);
router.delete("/:id", waterintakeController.deleteWaterintake);
router.put("/:id", waterintakeController.updateWaterintake);

module.exports = router;