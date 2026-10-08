const express = require("express");
const router = express.Router();
const { getCategories, createCategory, deleteCategory } = require("../controllers/category.controller");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");

router.get("/categories", getCategories);
router.post("/category", verifyTokenAndAdmin, createCategory);
router.delete("/categories/:id", verifyTokenAndAdmin, deleteCategory);

module.exports = router;
