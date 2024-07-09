// app error
const AppError = require("../utils/appError");
// model
const vendor_model = require("../Model/vendor_model");
// utility functions
const { successMessage } = require("../functions/success/success_functions");
// catchAsync
const catchAsync = require("../utils/catchAsync");
//const { refreshToken } = require("../utils/verifyToken_util");

// method GET
// route /api/v1/blockandunblock
// @desciption for Admin getvendor by id
const BlockedandunBlockedVendor = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const vendor = await vendor_model.findById({
    _id: id,
  }).select("-refreshToken")

  if (!vendor) {
    return next(new AppError("No vendor found with that ID", 400));
  }
  vendor.isBlock = !vendor.isBlock;
  await vendor.save();
  if (vendor.isBlock) {
    return successMessage(200, res, "vendor blocked", vendor);
  }
  if (!vendor.isBlock) {
    return successMessage(200, res, "vendor unblocked", vendor);
  }
});

module.exports = {
  BlockedandunBlockedVendor,
};
