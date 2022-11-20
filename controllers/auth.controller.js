const db = require("../models");
const config = require("../config/auth.config");
const { user: User, refreshToken: RefreshToken } = db;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require('express-validator');


exports.signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
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
        await User.create({
            id: req.body.id,
            password: bcrypt.hashSync(req.body.password, 8)
        }).then(async user => {
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
                // expiresIn: 60 // 1 min+ test
                expiresIn: config.jwtExpiration
            });



            let refresh_token = await RefreshToken.createToken(user);

            res.status(200).send({
                accessToken: access_token,
                refreshToken: refresh_token
            });
        })
            .catch(err => {
                res.status(500).send({ message: err.message });
            });
    }
};

exports.signin = (req, res) => {
    // console.log(req.session)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    User.findOne({
        where: {
            id: req.body.id
        }
    })
        .then(async user => {
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
                expiresIn: config.jwtExpiration
            });
            req.session.token = access_token.toString()
            let refresh_token = await RefreshToken.createToken(user);
            res.status(200).send({
                accessToken: access_token,
                refreshToken: refresh_token
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.refresh = async (req, res) => {

    const requestToken = req.params.new_token;

    if (requestToken == null) {
        return res.status(403).json({ message: "Refresh Token is empty!" });
    }

    try {
        let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });

        if (!refreshToken) {
            res.status(403).json({ message: "Refresh token is not in database!" });
            return;
        }

        if (RefreshToken.verifyExpiration(refreshToken)) {
            RefreshToken.destroy({ where: { id: refreshToken.id } });

            res.status(403).json({
                message: "Refresh token was expired. Please make a new signin request",
            });
            return;
        }

        const user = await refreshToken.getUser();
        let newAccessToken = jwt.sign({ id: user.id }, config.access_secret, {
            expiresIn: config.jwtExpiration,
        });

        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        });
    } catch (err) {
        return res.status(500).send({ message: err });
    }
}

exports.logout = async (req, res) => {
    const token = req.headers.authorization.substring(7, req.headers.authorization.length);
    const decoded = jwt.verify(token, config.access_secret);
    let userId = decoded.id
    let access_token = jwt.sign({ id: userId }, config.access_secret, {
        expiresIn: config.jwtExpiration
    });
    try {
        req.session = null;
        return res.status(200).json({ message: "You've been signed out!", newToken: access_token });
    } catch (err) {
        this.next(err);
    }

}