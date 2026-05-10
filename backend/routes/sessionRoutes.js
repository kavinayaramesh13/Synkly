const express = require("express");

const router = express.Router();

const protect =
    require("../middleware/authMiddleware");

const {
    createSession,
    getSessions
} = require(
    "../controllers/sessionController"
);

// CREATE SESSION

router.post(
    "/create",
    protect,
    createSession
);

// GET SESSIONS

router.get(
    "/",
    protect,
    getSessions
);

module.exports = router;