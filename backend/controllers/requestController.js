const pool = require("../config/db");

// SEND REQUEST

const sendRequest = async (req, res) => {

    try {

        const senderId = req.user;

        const { receiverId } = req.body;

        // Prevent duplicate request

        const existing =
            await pool.query(
                `
                SELECT * FROM requests
                WHERE sender_id = $1
                AND receiver_id = $2
                `,
                [senderId, receiverId]
            );

        if (existing.rows.length > 0) {

            return res.status(400).json({
                message: "Request already sent"
            });
        }

        const result =
            await pool.query(
                `
                INSERT INTO requests
                (sender_id, receiver_id)
                VALUES ($1, $2)
                RETURNING *
                `,
                [senderId, receiverId]
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

// GET MY REQUESTS

const getRequests = async (req, res) => {

    try {

        const userId = req.user;

        const result =
            await pool.query(
                `
                SELECT
                    requests.*,
                    users.name,
                    users.email
                FROM requests
                JOIN users
                ON requests.sender_id = users.id
                WHERE receiver_id = $1
                `,
                [userId]
            );

        res.json(result.rows);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};

// ACCEPT REQUEST

const acceptRequest = async (req, res) => {

    try {

        const { requestId } = req.body;

        const result =
            await pool.query(
                `
                UPDATE requests
                SET status = 'accepted'
                WHERE id = $1
                RETURNING *
                `,
                [requestId]
            );

        res.json(result.rows[0]);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};

module.exports = {
    sendRequest,
    getRequests,
    acceptRequest
};