const multer = require("multer");
const path = require("path");

// Define storage for multer
const multerStorageUser = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the path is correctly resolved
    cb(null, path.resolve(__dirname, "../files"));
  },
  filename: (req, file, cb) => {
    // Construct the filename
    const filename = `${Date.now()}-${file.originalname}`;
    req.file = `files/${filename}`;
    cb(null, filename);
  },
});
const uploadsUser = multer({
  storage: multerStorageUser,
});

// Export the middleware for handling the file upload
module.exports = uploadsUser.fields([{ name: "file", maxCount: 1 }]);
