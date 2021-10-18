const crypto = require("crypto");
const jwtSecret = crypto.randomBytes(64).toString("hex");
module.exports.jwtSecret = jwtSecret;

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const verify = require("./routes/trade/verify");
const buy = require("./routes/trade/buy");
const register = require("./routes/register");
const login = require("./routes/login");

const stockPriceUpdater = require("./updater/update");

dotenv.config();

const port = process.env.API_PORT || 3000;
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";
const app = express();
const tradeRouter = express.Router();
app.use(bodyParser.json());
app.use("/trade", tradeRouter);

mongoose.connect(mongoUri)
    .then(() => {
        console.log(`Project Shares backend database connected`);
    });

tradeRouter.use(verify);
tradeRouter.post("/buy", buy);

app.post("/register", register);
app.post("/login", login);

app.listen(port, () => {
    console.log(`Project Shares backend server listening on ${port}`);
});
