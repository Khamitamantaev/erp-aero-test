const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");

exports.allAccess = (req, res) => {
    res.status(200).send("Public");
};

exports.privateAccess = (req, res) => {
    res.status(200).send("Private");
};

exports.getInfo = (req, res) => {
    const token = req.headers.authorization.substring(7,  req.headers.authorization.length);
    const decoded = jwt.verify(token, config.access_secret);  
    let userId = decoded.id 
    res.json({
        id: userId
    }) 
};