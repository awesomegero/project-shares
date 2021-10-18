const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { jwtSecret } = require("../index");
const User = require("../models/user");

const login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password) {
        res.status(400).json({
            userMessage: "Bitte gebe einen Nutzernamen und ein Passwort an.",
        }).end();
        return;
    }

    User.findOne({ username }, (err, user) => {
        if(err) {
            res.status(500).json({
                userMessage: "Es gab einen Fehler beim Abfragen der Datenbank.",
            }).end();
            return;
        }

        if(!user) {
            res.status(404).json({
                userMessage: "Es gibt keinen Nutzer mit diesem Nutzernamen.",
            }).end();
            return;
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if(err) {
                res.status(500).json({
                    userMessage: "Es gab einen Fehler beim Prüfen des Passworts.",
                }).end();
                return;
            }

            if(!result) {
                res.status(403).json({
                    userMessage: "Das eingegebene Passwort ist falsch.",
                }).end();
                return;
            }

            jwt.sign({ username }, jwtSecret, { expiresIn: "3d" },(err, token) => {
               if(err) {
                   res.status(500).json({
                       userMessage: "Es gab einen Fehler beim Erstellen des Tokens.",
                   }).end();
                   return;
               }

               res.status(200).json({
                   userMessage: "Du bist erfolgreich eingeloggt.",
                   token,
               }).end();
            });
        });
    });
};

module.exports = login;
