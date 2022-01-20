const router = require("express-promise-router")();
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const authenticate = require("../middlewares/authenticate");

//imports
const PhotosController = require("../controllers/PhotosController");

//multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(
      __dirname,
      "..",
      "UploadedFiles",
      `${Date.now()}`
    );
    fs.mkdirSync(uploadsDir);
    cb(null, uploadsDir);
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname.split(" ").join("_").toLowerCase());
  },
});

//multer filefilter
const fileFilter = (req, file, cb) => {
  const isImage = file.mimetype.split("/")[0] === "image";
  if (!isImage) {
    req.fileValidationError = "file must be image";
    return cb(null, false, new Error("file must be image"));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
});

router
  .route("/files")
  .post(authenticate, upload.single("data"), PhotosController.uploadFile);
router.route("/files/:folder/:filename").get(PhotosController.downloadFile);
router.route("/files/:folder/:filename").delete(PhotosController.deleteFile);

module.exports = router;
