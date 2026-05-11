const pool = require("../config/db");

// SEND MESSAGE

const sendMessage = async (req, res) => {

    try {

        const senderId = req.user;

        const {
            receiverId,
            message
        } = req.body;

        const result =
            await pool.query(
                `
                INSERT INTO messages
                (
                    sender_id,
                    receiver_id,
                    message
                )
                VALUES ($1, $2, $3)
                RETURNING *
                `,
                [
                    senderId,
                    receiverId,
                    message
                ]
            );

        res.status(201).json(
            result.rows[0]
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};

// GET CONVERSATION

const getConversation = async (
    req,
    res
) => {

    try {

        const userId = req.user;

        const otherUserId =
            req.params.userId;

        const result =
            await pool.query(
                `
                SELECT *
                FROM messages
                WHERE
                (
                    sender_id = $1
                    AND receiver_id = $2
                )
                OR
                (
                    sender_id = $2
                    AND receiver_id = $1
                )
                ORDER BY created_at ASC
                `,
                [
                    userId,
                    otherUserId
                ]
            );

        res.json(result.rows);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};

module.exports = {
    sendMessage,
    getConversation
};