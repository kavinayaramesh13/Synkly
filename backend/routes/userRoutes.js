const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);

// protected route
router.get("/profile", protect, getProfile);

module.exports = router;

router.put("/profile", protect, updateProfile);