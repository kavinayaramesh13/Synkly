const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    findMatches
} = require("../controllers/matchController");

router.get("/", protect, findMatches);

module.exports = router;