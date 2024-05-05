const express = require("express");
const router = express.Router();
// controller functionss
const catController = require("../controllers/catController");

router.get("/", catController.getCats);
router.post("/", catController.addCat);
router.get("/:id", catController.getCat);
router.delete("/:id", catController.deleteCat);  
router.put("/:id", catController.updateCat);   

module.exports = router;
