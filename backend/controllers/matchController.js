const pool = require("../config/db");

const findMatches = async (req, res) => {
    try {

        const userId = req.user;

        // get current logged-in user
        const currentUserResult = await pool.query(
            "SELECT * FROM users WHERE id = $1",
            [userId]
        );

        const currentUser = currentUserResult.rows[0];

        // check if user exists
        if (!currentUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // find two-way barter matches
        const matchesResult = await pool.query(
            `
            SELECT * FROM users
            WHERE id != $1
            AND skills_offered && $2
            AND skills_wanted && $3
            `,
            [
                userId,
                currentUser.skills_wanted,
                currentUser.skills_offered
            ]
        );

        res.json(matchesResult.rows);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};

module.exports = {
    findMatches
};