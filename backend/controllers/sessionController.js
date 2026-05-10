const pool = require("../config/db");

const { v4: uuidv4 } =
    require("uuid");

// CREATE SESSION

const createSession = async (req, res) => {

    try {

        const senderId = req.user;

        const {
            receiverId,
            scheduled_time,
            duration
        } = req.body;

        const roomId = uuidv4();

        const result =
            await pool.query(
                `
                INSERT INTO sessions
                (
                    sender_id,
                    receiver_id,
                    scheduled_time,
                    duration,
                    room_id
                )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
                `,
                [
                    senderId,
                    receiverId,
                    scheduled_time,
                    duration,
                    roomId
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

// GET MY SESSIONS

const getSessions = async (req, res) => {

    try {

        const userId = req.user;

        const result =
            await pool.query(
                `
                SELECT *
                FROM sessions
                WHERE sender_id = $1
                OR receiver_id = $1
                ORDER BY scheduled_time ASC
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

module.exports = {
    createSession,
    getSessions
};