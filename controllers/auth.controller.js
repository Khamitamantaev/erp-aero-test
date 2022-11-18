const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

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
        console.log('CREATED')
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

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 600 // 10 min
            });
            res.status(200).send({
                id: user.id,
                username: user.username,
                email: user.email,
                accessToken: token
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};