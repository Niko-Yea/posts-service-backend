const router = require("express-promise-router")();
const controllerWrapper = require("../middlewares/controllerWrapper");
const authenticate = require("../middlewares/authenticate");

const PostsController = require("../controllers/PostsControllers");

router
  .route("/")
  .post(authenticate, controllerWrapper(PostsController.createPost));

router.route("/").get(controllerWrapper(PostsController.getAllPosts));

router.route("/:postId").get(controllerWrapper(PostsController.getById));

router
  .route("/:postId")
  .patch(authenticate, controllerWrapper(PostsController.editPost));

router
  .route("/:postId")
  .delete(authenticate, controllerWrapper(PostsController.deletePost));

router
  .route("/user/:userId")
  .get(authenticate, controllerWrapper(PostsController.getPostsByUser));

module.exports = router;
