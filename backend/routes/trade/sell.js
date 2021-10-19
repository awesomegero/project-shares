const User = require("../../models/user");
const Share = require("../../models/share");

const sell = async (req, res) => {
    const shareID = req.body.shareID;
    const buyTime = req.body.buyTime;
    const amount = req.body.amount;

    if(!shareID || !buyTime || !amount) {
        res.status(400).json({
            userMessage: "Bitte gebe die ID der gewünschten Aktie, die Kaufzeit und die Anzahl an.",
        }).end();
        return;
    }

    User.findOne({ username: req.body.username }, (err, user) => {
        if(err) {
            res.status(500).json({
                userMessage: "Es gab einen Fehler beim Suchen deines Nutzernamen in der Datenbank.",
            }).end();
            return;
        }

        if(!user) {
            res.status(500).json({
                userMessage: "Zu deinem Nutzer konnte kein Datenbankeintrag gefunden werden.",
            }).end();
            return;
        }

        const shareObject = user.shares.filter((element) => {
            return element.buyTime === buyTime && element.shareID === shareID;
        })[0];

        if(!shareObject) {
            res.status(404).json({
                userMessage: "Du besitzt diese Aktie nicht.",
            }).end();
            return;
        }

        if(shareObject.shareAmount < amount) {
            res.status(409).json({
                userMessage: "Du besitzt nicht genügend Aktien.",
            }).end();
            return;
        }

        const newShareAmount = shareObject.shareAmount - amount;

        Share.findOne({ shareID }, (err, currentShareObject) => {
            if(err) {
                res.status(500).json({
                    userMessage: "Es gab einen Fehler beim Finden der Aktie in der Datenbank.",
                }).end();
                return;
            }

            if(!currentShareObject) {
                res.status(500).json({
                    userMessage: "Die Aktien ID konnte keiner Aktie zugeordnet werden.",
                }).end();
                return;
            }

            const newMoneyBalance = user.moneyBalance + (amount * currentShareObject.sharePrice);

            if(newShareAmount === 0) {
                User.findOneAndUpdate({ username: req.body.username }, { $pull: { shares: { shareID, buyTime } }, moneyBalance: newMoneyBalance },
                    {},
                    (err, newUserObject) => {
                        if(err) {
                            res.status(500).json({
                                userMessage: "Es gab einen Fehler beim Löschen der Aktie aus deinem Depot.",
                            }).end();
                            return;
                        }

                        if(!newUserObject) {
                            res.status(500).json({
                                userMessage: "Es gab einen Fehler beim Finden deines Nutzerprofils während des Löschen der Aktie.",
                            }).end();
                            return;
                        }

                        res.status(200).json({
                            userMessage: `Du hast ${amount}x ${shareID} für ${amount * currentShareObject.sharePrice}$ verkauft.`,
                        }).end();
                    });
            }

            if(newShareAmount > 0) {
                const updatedStocks = user.shares;

                updatedStocks.forEach(element => {
                    if(element.buyTime === buyTime && element.shareID === shareID) {
                        element.shareAmount = newShareAmount;
                    }
                });

                User.findOneAndUpdate({ username: req.body.username }, { shares: updatedStocks, moneyBalance: newMoneyBalance }, {}, (err, newUserObject) => {
                    if(err) {
                        res.status(500).json({
                            userMessage: "Es gab einen Fehler beim Updaten deiner Shares.",
                        }).end();
                        return;
                    }

                    res.status(200).json({
                        userMessage: `Du hast ${amount}x ${shareID} für ${amount * currentShareObject.sharePrice}$ verkauft.`,
                    }).end();
                });
            }
        });
    });

};

module.exports = sell;
