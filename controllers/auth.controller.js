const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {

    const user = await User.findOne({
        where: {
            id: req.body.id
        }
    })
    if (user) {
        res.status(400).send({
            message: "Failed! ID is already exist!"
        });
    }

    if (!user) {
        const createdUser = await User.create({
            id: req.body.id,
            password: bcrypt.hashSync(req.body.password, 8)
        })
            .catch(err => {
                res.status(500).send({ message: err.message });
            });
        res.status(200).send({
            User: createdUser
        })
    }
};

exports.signin = (req, res) => {
    User.findOne({
        where: {
            id: req.body.id
        }
    })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            let passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            let access_token = jwt.sign({ id: user.id }, config.access_secret, {
                // expiresIn: 60 // 1 min+
                expiresIn: 60
            });

            let refresh_token = jwt.sign({ id: user.id }, config.refresh_secret, {
                expiresIn: 600 // 10 min+
            });

            res.status(200).send({
                accessToken: access_token,
                refresh_token: refresh_token
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.refresh = async (req, res) => {
    console.log(req.params.new_token)
}