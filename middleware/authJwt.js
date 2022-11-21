const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.config.js");

verifyToken = (req, res, next) => {

  try {
    let token = req.header("Authorization");
    // После выходе(logout) этот токен сохраняется. Это единственное что я не понял здесь.
    // Если я напишу здесь таким образом: let token = req.session.token
    // Он будет такой же, как и до выхода, а не undefined или null
    // Буду признателен, если поможете разобраться.
    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    jwt.verify(token, authConfig.access_secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!"
        });
      }
      req.userId = decoded.id;

      next();


    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const authJwt = {
  verifyToken: verifyToken,
};
module.exports = authJwt;