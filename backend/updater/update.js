const fs = require("fs");
const path = require("path");
const yahooStockPrices = require("yahoo-stock-prices");
const Share = require("../models/share");

const rawJson = fs.readFileSync(path.join(__dirname, "..", "..", "stocks.json"));
const stocks = JSON.parse(rawJson);

const stockPriceUpdater = setInterval(async () => {
    await updateStockPrice();
}, 1000 * 60 * 5);

const updateStockPrice = async () => {
    console.log("Updating stock prices");

    stocks.forEach((stock) => {
        yahooStockPrices.getCurrentPrice(stock.shareID, (err, price) => {
            if(err) {
                console.log(`Error getting price for ${stock.shareID} (${stock.shareName})`);
                return;
            }

            Share.findOneAndUpdate({
                shareID: stock.shareID,
                shareName: stock.shareName
            }, { sharePrice: price }, { upsert: true }, () => {
            });
        });
    });
};
updateStockPrice();

module.exports = stockPriceUpdater;
