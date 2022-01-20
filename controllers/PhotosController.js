const path = require("path");
const File = require("../models/file");
const { User } = require("../models/user");
const fs = require("fs/promises");

const checkDirExists = async (path) => {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
};

module.exports = {
  uploadFile: async (req, res, next) => {
    if (req.fileValidationError) {
      res.status(400).json({
        message: "File validation error. File must be image",
      });
      return;
    }
    const remove = await path.join(__dirname, "..", "UploadedFiles");
    const relPath = await req.file.path.replace(remove, "");
    const newFile = await new File(req.body);
    newFile.path = await relPath;

    const { avatarURL } = await User.findById(req.user.id);

    if (avatarURL) {
      const oldPhotoDir = path.join(
        __dirname,
        "..",
        "UploadedFiles",
        avatarURL,
        ".."
      );

      const isDirExist = await checkDirExists(oldPhotoDir);

      if (isDirExist) {
        fs.rmdir(oldPhotoDir, { recursive: true });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        avatarURL: relPath,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  },

  downloadFile: async (req, res, next) => {
    const dir = path.join(
      __dirname,
      "..",
      "UploadedFiles",
      `${req.params.folder}`,
      `${req.params.filename}`
    );
    res.download(dir, (err) => {
      if (err) {
        res.status(err.status).json(err.message);
      }
    });
  },

  deleteFile: async (req, res, next) => {
    const dir = path.join(
      __dirname,
      "..",
      "UploadedFiles",
      `${req.params.folder}`
    );

    const isDirExist = await checkDirExists(dir);

    if (!isDirExist) {
      res.status(404).json({ message: "file not found" });
      return;
    }

    fs.rmdir(dir, { recursive: true });
    res.status(204).json();
  },
};
