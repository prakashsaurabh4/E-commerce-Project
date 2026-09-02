const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUsers,
} = require("../controllers/authController");
const { protect, admin } = require("../middleware/authMiddleare");

// Authentication routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// User retrieval route
router.get("/", protect, admin, getUsers);

module.exports = router;
