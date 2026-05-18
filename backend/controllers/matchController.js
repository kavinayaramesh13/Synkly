const pool = require("../config/db");

const parseSkills = (skills) => {

    if (!skills) {
        return [];
    }

    /* POSTGRES ARRAY */

    if (Array.isArray(skills)) {

        return skills
            .filter(skill => skill)
            .map(skill =>
                String(skill)
                    .trim()
                    .toLowerCase()
            );
    }

    /* POSTGRES STRING FORMAT */

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

        const currentUserId =
            req.user;

        /* CURRENT USER */

        const currentUserResult =
            await pool.query(
                `
                SELECT *
                FROM users
                WHERE id = $1
                `,
                [currentUserId]
            );

        const currentUser =
            currentUserResult.rows[0];

        if (!currentUser) {

            return res.status(404).json({
                message:
                    "User not found"
            });
        }

        /* CURRENT USER SKILLS */

        const currentOffered =
            parseSkills(
                currentUser.skills_offered
            );

        const currentWanted =
            parseSkills(
                currentUser.skills_wanted
            );

        /* GET OTHER USERS */

        const usersResult =
            await pool.query(
                `
                SELECT *
                FROM users
                WHERE id != $1
                `,
                [currentUserId]
            );

        const allUsers =
            usersResult.rows;

        /* MATCHING */

        const matches =
            allUsers.map((user) => {

                const offeredSkills =
                    parseSkills(
                        user.skills_offered
                    );

                const wantedSkills =
                    parseSkills(
                        user.skills_wanted
                    );

                /* USER OFFERS WHAT I WANT */

                const offeredMatch =
                    offeredSkills.filter(
                        skill =>
                            currentWanted.includes(skill)
                    );

                /* USER WANTS WHAT I OFFER */

                const wantedMatch =
                    wantedSkills.filter(
                        skill =>
                            currentOffered.includes(skill)
                    );

                let matchPercentage = 0;

                /* PERFECT TWO-WAY MATCH */

                if (

                    offeredMatch.length > 0 &&
                    wantedMatch.length > 0

                ) {

                    matchPercentage = 100;

                }

                /* ONE-WAY MATCH */

                else if (

                    offeredMatch.length > 0 ||
                    wantedMatch.length > 0

                ) {

                    matchPercentage = 50;
                }

                return {

                    ...user,

                    skills_offered:
                        offeredSkills,

                    skills_wanted:
                        wantedSkills,

                    offeredMatch,

                    wantedMatch,

                    matchPercentage
                };
            });

        /* FILTER MATCHES */

        const filteredMatches =
            matches.filter(
                user =>
                    user.matchPercentage > 0
            );

        /* SORT */

        filteredMatches.sort(
            (a, b) =>
                b.matchPercentage -
                a.matchPercentage
        );

        res.json(
            filteredMatches
        );

    } catch (error) {

        console.log(
            "MATCH ERROR:"
        );

        console.log(error);

        res.status(500).json({

            message:
                "Server Error"
        });
    }
};

module.exports = {
    getMatches
};