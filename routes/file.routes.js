const controller = require("../controllers/file.controller");
const { authJwt } = require("../middleware");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/file/upload", [authJwt.verifyToken], controller.upload);
  app.get("/file/list",[authJwt.verifyToken], controller.list);
  app.delete("/file/delete/:id",[authJwt.verifyToken], controller.deleteById);
  app.get("/file/:id",[authJwt.verifyToken], controller.getFileById);
  app.get("/file/download/:id",[authJwt.verifyToken], controller.downloadById);
  app.put("/file/update/:id",[authJwt.verifyToken], controller.updateById);
};