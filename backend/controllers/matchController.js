const pool = require("../config/db");

const parseSkills = (skills) => {

    if (!skills) {
        return [];
    }

    // PostgreSQL array already parsed

    if (Array.isArray(skills)) {

        return skills
            .filter(skill => skill)
            .map(skill =>
                String(skill)
                    .trim()
                    .toLowerCase()
            );
    }

    // PostgreSQL string format

    if (typeof skills === "string") {

        return skills
            .replace(/[{}]/g, "")
            .split(",")
            .filter(skill => skill)
            .map(skill =>
                String(skill)
                    .trim()
                    .toLowerCase()
            );
    }

    return [];
};

const getMatches = async (req, res) => {

    try {

        // FIXED

        const currentUserId = req.user;

        // Current User

        const currentUserResult =
            await pool.query(
                "SELECT * FROM users WHERE id = $1",
                [currentUserId]
            );

        const currentUser =
            currentUserResult.rows[0];

        // User safety

        if (!currentUser) {

            return res.status(404).json({
                message: "User not found"
            });
        }

        // Normalize current user skills

        const currentOffered =
            parseSkills(
                currentUser.skills_offered
            );

        const currentWanted =
            parseSkills(
                currentUser.skills_wanted
            );

        // Get all other users

        const usersResult =
            await pool.query(
                "SELECT * FROM users WHERE id != $1",
                [currentUserId]
            );

        const allUsers =
            usersResult.rows;

        // Match users

        const matches = allUsers.map((user) => {

            const offeredSkills =
                parseSkills(
                    user.skills_offered
                );

            const wantedSkills =
                parseSkills(
                    user.skills_wanted
                );

            // Two-way matching

            const offeredMatch =
                offeredSkills.filter(skill =>
                    currentWanted.includes(skill)
                );

            const wantedMatch =
                wantedSkills.filter(skill =>
                    currentOffered.includes(skill)
                );

            const totalMatches =
                offeredMatch.length +
                wantedMatch.length;

            const totalSkills =
                currentOffered.length +
                currentWanted.length;

            const matchPercentage =
                totalSkills > 0
                    ? Math.round(
                        (totalMatches / totalSkills) * 100
                      )
                    : 0;

            return {
                ...user,
                matchPercentage
            };
        });

        // Only useful matches

        const filteredMatches =
            matches.filter(
                user => user.matchPercentage > 0
            );

        // Sort highest first

        filteredMatches.sort(
            (a, b) =>
                b.matchPercentage -
                a.matchPercentage
        );

        res.json(filteredMatches);

    } catch (error) {

        console.log("MATCH ERROR:");

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};

module.exports = {
    getMatches
};