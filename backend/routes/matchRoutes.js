const express = require("express");

const router = express.Router();

const {
    getMatches
} = require("../controllers/matchController");

const authMiddleware =
    require("../middleware/authMiddleware");

router.get(
    "/",
    authMiddleware,
    getMatches
);

module.exports = router;