// app error
const AppError = require("../utils/appError");
// model
const admin_model = require("../Model/admin_model");
const product_model = require("../Model/product_model");
const vendor_model = require("../Model/vendor_model");
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

// method GET
// route /api/v1/Admin/logout
// @desciption for Admin Dashboard
const adminDashboard = catchAsync(async (req, res, next) => {
  // Fetch all products
  const products = await product_model.countDocuments();

  // Fetch vendors based on the logged-in admin's vendorId
  const vendors = await vendor_model.countDocuments();
  const blockedvendors = await vendor_model.countDocuments({ isBlock: true });
  // set value in  all vendors with specific conditions
  // const result = await vendor_model.updateMany(
  //   { isBlock: { $ne: true } },
  //   { $set: { isBlock: false } }
  // );

  const unblockedvendors = await vendor_model.countDocuments({
    isBlock: false,
  });
  // Log totals (optional)
  // console.log(`Total Vendors: ${vendors}`);
  // console.log(`Total blockedvendors: ${blockedvendors}`);
  // console.log(`Total unblockedvendors: ${unblockedvendors}`);
  // console.log(`Total Products: ${products}`);

  // Return success response
  return successMessage(202, res, "Dashboard", {
    products,
    vendors,
    blockedvendors,
    unblockedvendors,
  });
});

// method GET
// route /api/v1/admin/vendors
// @desciption for Admin get all Vendors
const getVendors = catchAsync(async (req, res, next) => {
  // console.log(`Searching for vendors with vendorId: ${req.user.id}`);
  const vendors = await vendor_model
    .find({})
    .select("-refreshToken -password -forgetPassword");
  if (!vendors) {
    return next(new AppError("No vendor found", 400));
  }
  successMessage(202, res, "get all Vendors", vendors);
});

const getallVendorswithoutToken = catchAsync(async (req, res, next) => {
  // console.log(`Searching for vendors with vendorId: ${req.user.id}`);
  const vendors = await vendor_model
    .find({})
    .select("-refreshToken -password -forgetPassword");
  if (!vendors) {
    return next(new AppError("No vendor found", 400));
  }
  successMessage(202, res, "get all Vendors", vendors);
});
module.exports = {
  loginAdmin,
  logoutAdmin,
  adminDashboard,
  getVendors,
  getallVendorswithoutToken,
};
