const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.put(
    "/api/users/:id",
    controller.updateUser
  );
  app.get(
    "/api/users/:id",
    [authJwt.verifyToken,authJwt.isModerator],
    controller.getUserById
  );
  app.get(
    "/api/users",
    controller.getAllUsers
  );

  app.delete(
    "/api/users/:id",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.deleteUser
  );
};
