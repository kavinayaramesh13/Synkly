const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const pool = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Synkly Backend Running");
});

const PORT = process.env.PORT || 5000;

pool.connect()
    .then(() => console.log("PostgreSQL Connected"))
    .catch(err => console.log(err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);