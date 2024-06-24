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
  loginVendorValidation,
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
  // const { name, email, password, phone,companyName } = req.body;
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

// method POST
// route /api/v1/vendor/login
// @desciption for login of vender
const loginVendor = catchAsync(async (req, res, next) => {
  const { error, value } = loginVendorValidation.validate(req.body);
  if (error) {
    const errors = error.details.map((el) => el.message);
    return next(new AppError(errors, 400));
  }
  const vendorExists = await vendor_model.findOne({
    email:value.email,
  });
  if (!vendorExists) {
    return next(new AppError("Vendor not found", 400));
  }
  const hashedPassword = CryptoJS.AES.decrypt(
    vendorExists.password,
    process.env.CRYPTO_SEC
  );
  const realPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
  if (realPassword !== value.password) {
    return next(new AppError("Incorrect password", 400));
  }
  const { refreshToken, accessToken } = generateAccessTokenRefreshToken(
    vendorExists._id
  );
  vendorExists.refreshToken.push(refreshToken);
  await vendorExists.save();
  vendorExists.refreshToken = undefined;
  vendorExists.password = undefined;
  return successMessage(202, res, "login success", {
    ...JSON.parse(JSON.stringify(vendorExists)),
    accessToken,
    refreshToken,
  });
}); 

module.exports = {
  signUpVendor,
  loginVendor,
};
