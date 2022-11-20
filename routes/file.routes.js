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

  app.post("/file/upload", controller.upload);
  app.get("/file/list/:list_size", controller.list);
  app.delete("/file/delete/:id", controller.deleteById);
};