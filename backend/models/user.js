const mongoose = require("mongoose");

const userSchmema = new mongoose.Schema({
    username: String,
    password: String,
    moneyBalance: Number,
    shareBalance: Number,
    depotBalance: Number,
    shares: Array
});

const User = mongoose.model("User", userSchmema);
module.exports = User;
