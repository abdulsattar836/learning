// catch
const catchAsync = require("../utils/catchAsync");

// success
const { successMessage } = require("../functions/success/success_functions");

// route /api/v1/file/
// @description       POST file
// @Access            vender can do this
const uploadFile = catchAsync(async (req, res, next) => {
  const fileName = req.file;
  if (!fileName) {
    return next(new Error("File not found"));
  }
  return successMessage(202, res, "success fully get file", fileName);
});

module.exports = {
  uploadFile,
};
