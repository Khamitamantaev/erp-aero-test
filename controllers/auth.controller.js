const db = require("../models");
const config = require("../config/auth.config");
const {user: User, refreshToken: RefreshToken} = db;
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
                expiresIn: 60
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
};

exports.refresh = async (req, res) => {

    const requestToken  = req.params.new_token;

    console.log('Текущий токен: ', requestToken)

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