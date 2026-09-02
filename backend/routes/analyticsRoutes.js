const express = require("express");

const { protect } = require("../middleware/authMiddleare");
const { admin } = require("../middleware/adminMiddleware");
const { getAdminStats } = require("../controllers/analyticsController");

const router = express.Router();

router.get("/").post(protect, admin, getAdminStats);


module.exports = router;