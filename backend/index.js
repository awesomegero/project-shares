const crypto = require("crypto");
const jwtSecret = crypto.randomBytes(64).toString("hex");
module.exports.jwtSecret = jwtSecret;

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const register = require("./routes/register");
const login = require("./routes/login");

dotenv.config();

const port = process.env.API_PORT || 3000;
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";
const app = express();
app.use(bodyParser.json());

mongoose.connect(mongoUri)
    .then(() => {
        console.log(`Project Shares backend database connected`);
    });

app.post("/register", register);
app.post("/login", login);

app.listen(port, () => {
    console.log(`Project Shares backend server listening on ${port}`);
});
