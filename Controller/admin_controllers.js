// app error
const AppError = require("../utils/appError");
// model
const admin_model = require("../Model/admin_model");
// utility functions
const { successMessage } = require("../functions/success/success_functions");
// catchAsync
const catchAsync = require("../utils/catchAsync");
// validation
const {
  loginAdminValidation,
} = require("../utils/validation/admin_joi_validation");

// authorization
const {
  generateAccessTokenRefreshToken,
} = require("../utils/verifyToken_util");
const {
  userPasswordCheck,
} = require("../functions/password/password_functions");

// method POST
// route /api/v1/Admin/login
// @desciption for login of admin
const loginAdmin = catchAsync(async (req, res, next) => {
  const { error, value } = loginAdminValidation.validate(req.body);
  if (error) {
    const errors = error.details.map((el) => el.message);
    return next(new AppError(errors, 400));
  }
  const admin = await admin_model.findOne({ email: value.email });
  if (!admin) {
    return next(new AppError("not admin with this email", 400));
  }
  userPasswordCheck(admin, value.password);
  const {
    password: pass,
    refreshToken: refresh,
    ...filteredAdminFields
  } = JSON.parse(JSON.stringify(admin));
  const { refreshToken, accessToken } = generateAccessTokenRefreshToken(
    admin._id
  );
  admin.refreshToken.push(refreshToken);
  await admin.save();
  admin.refreshToken = undefined;
  admin.password = undefined;
  return successMessage(202, res, "login success", {
    ...filteredAdminFields,
    accessToken,
    refreshToken,
  });
});

// method POST
// route /api/v1/Admin/logout
// @desciption for logout of admin
const logoutAdmin = (model) =>
  catchAsync(async (req, res, next) => {
    let refreshToken = req.header("Authorization");
    if (!refreshToken) {
      return next(new AppError("refreshToken is required", 400));
    }
    refreshToken = refreshToken.split(" ");
    refreshToken = refreshToken[1];
    const user = await model.findOne({ refreshToken });
    if (!user) {
      return next(new AppError("this refreshToken not exist", 400));
    }

    await model.updateOne(
      { refreshToken: refreshToken },
      { $pull: { refreshToken: refreshToken } }
    );

    return successMessage(202, res, "logout successfully", null);
  });
// let newPassword = 'NewPassword';
// console.log(CryptoJS.AES.encrypt(
//   newPassword,
//   process.env.CRYPTO_SEC
// ).toString())
module.exports = {
  loginAdmin,
  logoutAdmin,
};
