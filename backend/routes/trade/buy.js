const User = require("../../models/user");
const Share = require("../../models/share");

const buy = async (req, res) => {
    const shareID = req.body.shareID;
    const amount = req.body.amount;

    if(!shareID || !amount) {
        res.status(400).json({
            userMessage: "Bitte gebe die ID der gewünschten Aktie und die Anzahl an.",
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

        Share.findOne({ shareID }, (err, shareObject) => {
            if(err) {
                res.status(500).json({
                    userMessage: "Es gab einen Fehler beim Suchen der Aktie in der Datenbank.",
                }).end();
                return;
            }

            if(!shareObject) {
                res.status(404).json({
                    userMessage: "Die Aktie gibt es nicht.",
                }).end();
                return;
            }

            const orderCost = shareObject.sharePrice * amount;

            if(user.moneyBalance < orderCost) {
                res.status(409).json({
                    userMessage: "Du hast nicht genügend Bargeld zum kaufen der Aktie.",
                }).end();
                return;
            }

            const userShareObject = {
                buyTime: Date.now(),
                buyPrice: shareObject.sharePrice,
                shareID: shareObject.shareID
            };
            const newMoneyBalance = user.moneyBalance - orderCost;

            User.findOneAndUpdate({ username: req.body.username }, { $push: { shares: userShareObject }, moneyBalance: newMoneyBalance }, {}, (err, newUserObject) => {
                if(err) {
                    res.status(500).json({
                        userMessage: "Es gab einen Fehler beim Updaten deines Nutzers in der Datenbank.",
                    }).end();
                    return;
                }
                if(!newUserObject) {
                  res.status(500).json({
                      userMessage: "Es gab einen Fehler beim Finden deines Nutzerprofils während des Updaten.",
                  }).end();
                  return;
                }

                res.status(201).json({
                    userMessage: `Du hast erfolgreich ${amount}x ${shareID} für ${orderCost}$ gekauft.`,
                }).end();
            });
        });
    });
};

module.exports = buy;
