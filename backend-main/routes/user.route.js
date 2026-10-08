const express = require("express");
const router = express.Router();
const {
  GetUser,
  updateProfile,
  getCreatorsCount,
  getAdvertisersCount,
  getCreators,
  getAdvertisers,
  verifyAdvertiser,
  suspendAdvertiser,
  deleteUserAccount,
} = require("../controllers/user.controller");
const { verifyToken, verifyTokenAndAdmin } = require("../middleware/verifyToken");
const mediaUpload = require("../middleware/mediaUpload");

router.get("/getuser", verifyToken, GetUser);
router.put("/updateProfile", mediaUpload.single("profilePhoto"), verifyToken, updateProfile);
router.get("/creators/count", verifyTokenAndAdmin, getCreatorsCount);
router.get("/advertisers/count", verifyTokenAndAdmin, getAdvertisersCount);
router.get("/creators", verifyToken, getCreators);
router.get("/advertisers", verifyTokenAndAdmin, getAdvertisers);
router.put("/:id/verify", verifyTokenAndAdmin, verifyAdvertiser);
router.put("/:id/suspend", verifyTokenAndAdmin, suspendAdvertiser);
router.delete("/:id", verifyTokenAndAdmin, deleteUserAccount);

module.exports = router;
