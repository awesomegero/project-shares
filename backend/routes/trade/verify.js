const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../index");

const verify = async (req, res, next) => {
    if(!req.headers.authorization) {
        res.status(401).json({
            userMessage: "Du bist nicht eingeloggt.",
        }).end();
        return;
    }

    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, jwtSecret, (err, user) => {
        if(err) {
            res.status(403).json({
                userMessage: "Dein Token ist falsch oder abgelaufen.",
            }).end();
            return;
        }

        req.body.username = user.username;
        next();
    });
};

module.exports = verify;
