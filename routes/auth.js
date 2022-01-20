const router = require("express-promise-router")();
const authenticate = require("../middlewares/authenticate");
const controllerWrapper = require("../middlewares/controllerWrapper");
const UserController = require("../controllers/UserControllers");

router.route("/signup").post(controllerWrapper(UserController.signup));
router.route("/signin").post(controllerWrapper(UserController.signin));
router
  .route("/logout")
  .post(authenticate, controllerWrapper(UserController.logout));
router
  .route("/current")
  .get(authenticate, controllerWrapper(UserController.getCurrentUsr));

module.exports = router;
