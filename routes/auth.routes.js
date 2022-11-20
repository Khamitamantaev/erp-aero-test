const controller = require("../controllers/auth.controller");
const { body } = require('express-validator');
const e = require("cors");
const { authJwt } = require("../middleware");
const validate = (data) => {
    if (!/^([0-9]{9})|([A-Za-z0-9._%\+\-]+@[a-z0-9.\-]+\.[a-z]{2,3})$/.test(data)) {
        return false;
    }
    return true
};

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/signup",
        body('id').custom(value => {
            return validate(value)
        }),
        controller.signup
    );

    app.post("/signin/:new_token", controller.refresh)

    app.post("/signin", body('id').custom(value => {
        return validate(value)
    }), controller.signin);

    app.get("/logout", [authJwt.verifyToken], controller.logout)
};