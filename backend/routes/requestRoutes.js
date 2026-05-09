const express = require("express");

const router = express.Router();

const protect =
    require("../middleware/authMiddleware");

const {
    sendRequest,
    getRequests,
    acceptRequest
} = require("../controllers/requestController");

// Send request

router.post(
    "/send",
    protect,
    sendRequest
);

// Get incoming requests

router.get(
    "/",
    protect,
    getRequests
);

// Accept request

router.put(
    "/accept",
    protect,
    acceptRequest
);

module.exports = router;