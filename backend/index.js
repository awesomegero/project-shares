const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const crypto = require("crypto");

dotenv.config();
const jwtSecret = crypto.randomBytes(64);
const port = process.env.API_PORT || 3000;
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";
const app = express();

mongoose.connect(mongoUri)
    .then(() => {
        console.log(`Project Shares backend database connected`);
    });

app.listen(port, () => {
    console.log(`Project Shares backend server listening on ${port}`);
});
