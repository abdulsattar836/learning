// app error
const AppError = require("../utils/appError");
// model
const vendor_model = require("../Model/vendor_model");
// password encryption
const CryptoJS = require("crypto-js");
// utility functions
const { successMessage } = require("../functions/success/success_functions");
// catchAsync
const catchAsync = require("../utils/catchAsync");
// validation
const {
  signupVendorValidation,
} = require("../utils/validation/vendor_joi_validation");

// authorization
const {
  generateAccessTokenRefreshToken,
} = require("../utils/verifyToken_util");

// method POST
// route /api/v1/vendor/signup
// @desciption for signup of vender
const signUpVendor = catchAsync(async (req, res, next) => {
  const { error, value } = signupVendorValidation.validate(req.body);
  if (error) {
    const errors = error.details.map((el) => el.message);
    return next(new AppError(errors, 400));
  }
  const encryptPassword = CryptoJS.AES.encrypt(
    value.password,
    process.env.CRYPTO_SEC
  ).toString();
  const venderExists = await vendor_model.findOne({
    email: value.email,
  });
  if (venderExists) {
    return next(new AppError("Vendor already exists", 400));
  }
  let newVendor = await vendor_model.create({
    ...value,
    password: encryptPassword,
  });
  newVendor = JSON.parse(JSON.stringify(newVendor));
  newVendor.password = undefined;
  newVendor.refreshToken = undefined;
  newVendor.forgetPassword = undefined;
  const { refreshToken, accessToken } = generateAccessTokenRefreshToken(
    newVendor._id
  );
  successMessage(202, res, "signup success", {
    ...newVendor,
    accessToken,
    refreshToken,
  });
});

module.exports = {
  signUpVendor,
};
