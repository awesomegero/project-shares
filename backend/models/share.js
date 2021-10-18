const mongoose = require("mongoose");

const shareSchmema = new mongoose.Schema({
    shareID: String,
    shareName: String,
    sharePrice: Number
});

const Share = mongoose.model("Share", shareSchmema);
module.exports = Share;
