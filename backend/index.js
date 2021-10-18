const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const crypto = require("crypto");

dotenv.config();
const jwtSecret = crypto.randomBytes(64);
const port = process.env.API_PORT || 3000;
const app = express();

app.listen(port, () => {
    console.log(`Project Shares backend server listening on ${port}`);
});
