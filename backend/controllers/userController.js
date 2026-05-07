const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER USER
const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            skills_offered,
            skills_wanted
        } = req.body;

        // check existing user
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // insert user
        const result = await pool.query(
            `INSERT INTO users
            (name, email, password, skills_offered, skills_wanted)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                name,
                email,
                hashedPassword,
                skills_offered,
                skills_wanted
            ]
        );

        const user = result.rows[0];

        // generate JWT token
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            token,
            user
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};

// LOGIN USER
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // find user
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        const user = result.rows[0];

        // check user exists
        if (!user) {
            return res.status(400).json({
                message: "Invalid Credentials"
            });
        }

        // compare passwords
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid Credentials"
            });
        }

        // generate JWT token
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            user
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};

// GET USER PROFILE (PROTECTED)
const getProfile = async (req, res) => {
    try {

        const result = await pool.query(
            "SELECT * FROM users WHERE id = $1",
            [req.user]
        );

        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};

const updateProfile = async (req, res) => {
    try {

        const {
            name,
            bio,
            skills_offered,
            skills_wanted,
            experience_level,
            availability
        } = req.body;

        const result = await pool.query(
            `
            UPDATE users
            SET
                name = $1,
                bio = $2,
                skills_offered = $3,
                skills_wanted = $4,
                experience_level = $5,
                availability = $6
            WHERE id = $7
            RETURNING *
            `,
            [
                name,
                bio,
                skills_offered,
                skills_wanted,
                experience_level,
                availability,
                req.user
            ]
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
    registerUser,
    loginUser,
    getProfile,
    updateProfile
};