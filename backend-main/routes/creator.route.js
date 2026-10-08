const express = require("express");
const router = express.Router();
const {
  getCreatorCategories,
  searchCreators,
  verifyCreator,
  suspendCreator,
  deleteCreator,
} = require("../controllers/user.controller");
const { verifyToken, verifyTokenAndAdmin } = require("../middleware/verifyToken");

router.get("/creators/categories", verifyToken, getCreatorCategories);
router.get("/creators/search", verifyToken, searchCreators);
router.patch("/creators/:id/verify", verifyTokenAndAdmin, verifyCreator);
router.patch("/creators/:id/suspend", verifyTokenAndAdmin, suspendCreator);
router.delete("/creators/:id", verifyTokenAndAdmin, deleteCreator);

module.exports = router;
