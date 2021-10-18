const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { jwtSecret } = require("../index");

const register = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password) {
        res.status(400).end();
        return;
    }

    User.findOne({ username }, (err, user) => {
        if(err) {
            res.status(500).json({
                userMessage: "Es gab einen Fehler beim Abfragen der Datenbank.",
            }).end();
            return;
        }

        if(user) {
            res.status(409).json({
                userMessage: "Dieser Nutzername existiert bereits.",
            }).end();
            return;
        }

        bcrypt.hash(password, 12, (err, hash) => {
            if(err) {
                res.status(500).json({
                    userMessage: "Es gab einen Fehler beim Erstellen deines Kontos."
                }).end();
                return;
            }

            jwt.sign({ username }, jwtSecret, {}, (err, token) => {
                if(err) {
                    console.log(err);

                    res.status(500).json({
                        userMessage: "Es gab einen Fehler beim Erstellen des Tokens.",
                    }).end();
                    return;
                }

                User.create({
                    username,
                    password: hash,
                    moneyBalance: 50000,
                    shareBalance: 0,
                    depotBalance: 50000,
                    shares: [],
                }).then(() => {
                    res.status(201).json({
                        userMessage: "Dein Nutzerkonto wurde erstellt.",
                        token,
                    }).end();
                });
            });
        })
    })
};

module.exports = register;
