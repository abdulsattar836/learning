const multer = require("multer");
const path = require("path");
const {
  getExtensionOfFile,
} = require("../../functions/forFiles/forFiles_functions");

const multerStorageUser = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../files"); // Correct path to files directory
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    try {
      console.log(file);
      const fileExtension = getExtensionOfFile(file.originalname);
      const filename = `${Date.now()}.${fileExtension}`;
      req.file = `${filename}`;
      cb(null, filename);
    } catch (err) {
      console.error(err);
      cb(err);
    }
  },
});

const uploadsUser = multer({
  storage: multerStorageUser,
});

module.exports = uploadsUser.fields([{ name: "file", maxCount: 100 }]); // Changed "photo" to "file"
