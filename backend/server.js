const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const matchRoutes = require("./routes/matchRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);

// test route
app.get("/", (req, res) => {
    res.send("Synkly API Running");
});

// database connection test
pool.connect()
    .then(() => {
        console.log("PostgreSQL Connected");
    })
    .catch((err) => {
        console.log(err);
    });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});