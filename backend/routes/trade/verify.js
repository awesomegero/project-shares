const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../index");

const verify = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];

    if(!token) {
        res.status(401).json({
            userMessage: "Du bist nicht eingeloggt.",
        }).end();
        return;
    }

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
