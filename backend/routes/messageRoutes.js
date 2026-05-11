const express = require("express");

const router = express.Router();

const protect =
    require("../middleware/authMiddleware");

const {
    sendMessage,
    getConversation
} = require(
    "../controllers/messageController"
);

// SEND MESSAGE

router.post(
    "/send",
    protect,
    sendMessage
);

// GET CHAT

router.get(
    "/:userId",
    protect,
    getConversation
);

module.exports = router;