const User = require("../../models/user");

const info = async (req, res) => {
    User.findOne({ username: req.body.username }, (err, userDB) => {
        if(err) {
            res.status(500).json({
                userMessage: "Es gab einen Fehler beim Finden deines Nutzerprofils.",
            }).end();
            return;
        }
        if(!userDB) {
            res.status(500).json({
                userMessage: "Dein Nutzerprofil konnte nicht gefunden werden.",
            }).end();
            return;
        }

        res.status(200).json({
            userMessage: "Nutzerdaten erfolgreich geladen!",
            userData: {
                moneyBalance: userDB.moneyBalance,
                shares: userDB.shares,
            },
        }).end();
    })
};

module.exports = info;
