// app error
const AppError = require("../utils/appError");
// catchAsync
const catchAsync = require("../utils/catchAsync");
// model
const user_model = require("../Model/user_model");
// password encryption
const CryptoJS = require("crypto-js");
// utility functions
const { successMessage } = require("../functions/success/success_functions");
// validation
const {
  signupUserValidation,
  loginUserValidation,
  updateprofileValidation,
} = require("../utils/validation/user_joi_validation");
// authorization
const {
  generateAccessTokenRefreshToken,
} = require("../utils/verifyToken_util");
const sendOTPEmail = require("../utils/sendEmail/emailsend");

const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
  return otp;
};

// method POST
// route /api/v1/user/signup
// @description for signup of user
const signUpUser = catchAsync(async (req, res, next) => {
  // Validate request body
  const { error, value } = signupUserValidation.validate(req.body);
  if (error) {
    const errors = error.details.map((el) => el.message);
    return next(new AppError(errors, 400));
  }

  const { name, email, phoneNumber, password, location } = value;

  // Check if user already exists
  let existingUser = await user_model.findOne({ email });

  if (existingUser) {
    if (existingUser.isVerified) {
      // User is already verified, prompt to log in
      return next(
        new AppError("You are already signed up, please log in", 400)
      );
    } else {
      // User is not verified, resend OTP
      const otp = generateOTP();
      existingUser.otp = otp;
      await existingUser.save();
      await sendOTPEmail(email, otp);
      return successMessage(202, res, "OTP resent, please verify your email", {
        email,
      });
    }
  } else {
    // Encrypt password
    const encryptPassword = CryptoJS.AES.encrypt(
      password,
      process.env.CRYPTO_SEC
    ).toString();

    // Create a new user with OTP
    const otp = generateOTP();
    newUser = await user_model.create({
      name,
      email,
      phoneNumber,
      password: encryptPassword,
      location,
      otp,
    });

    await sendOTPEmail(email, otp);

    // Remove sensitive data before sending response
    newUser = JSON.parse(JSON.stringify(newUser));
    newUser.password = undefined;
    newUser.refreshToken = undefined;

    const { refreshToken, accessToken } = generateAccessTokenRefreshToken(
      newUser._id
    );

    return successMessage(
      202,
      res,
      "Sign-up successful, please verify your email",
      {
        ...newUser,
        accessToken,
        refreshToken,
      }
    );
  }
});

// method POST
// route /api/v1/user/login
// @desciption for login of user
const loginUser = catchAsync(async (req, res, next) => {
  const { error, value } = loginUserValidation.validate(req.body);
  if (error) {
    const errors = error.details.map((el) => el.message);
    return next(new AppError(errors, 400));
  }
  const userExists = await user_model.findOne({
    email: value.email,
  });
  if (!userExists) {
    return next(new AppError("User not found", 400));
  }
  if (!userExists.isVerified) {
    return next(new AppError("Email not verified", 400));
  }
  if (userExists.isBlock) {
    return next(new AppError("User is block", 400));
  }
  const hashedPassword = CryptoJS.AES.decrypt(
    userExists.password,
    process.env.CRYPTO_SEC
  );
  //console.log(hashedPassword);
  const realPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
  if (realPassword !== value.password) {
    return next(new AppError("Incorrect password", 400));
  }
  const { refreshToken, accessToken } = generateAccessTokenRefreshToken(
    userExists._id
  );
  userExists.refreshToken.push(refreshToken);
  await userExists.save();
  userExists.refreshToken = undefined;
  userExists.password = undefined;
  return successMessage(202, res, "login success", {
    ...JSON.parse(JSON.stringify(userExists)),
    accessToken,
    refreshToken,
  });
});

const verifyOTP = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;

  // Validate request
  if (!email || !otp) {
    return next(new AppError("Email and OTP are required", 400));
  }

  // Find user by email
  const newUser = await user_model.findOne({ email });

  if (!newUser) {
    return next(new AppError("User not found", 404));
  }

  // Check if user is already verified
  if (newUser.isVerified) {
    return next(new AppError("User is already verified", 400));
  }

  console.log("Stored OTP:", newUser.otp);
  console.log("Provided OTP:", otp);

  // Compare OTP
  if (newUser.otp !== otp) {
    return next(new AppError("Invalid OTP", 400));
  }

  // Mark user as verified
  newUser.isVerified = true;
  newUser.otp = undefined; // Clear OTP after successful verification
  await newUser.save();

  // Generate tokens
  const { refreshToken, accessToken } = generateAccessTokenRefreshToken(
    newUser._id
  );

  // Send success response
  return successMessage(200, res, "Email verified successfully", {
    accessToken,
    refreshToken,
  });
});



const updateProfile = catchAsync(async (req, res, next) => {
    // Validate request body
    const { error, value } = updateprofileValidation.validate(req.body);
    if (error) {
      const errors = error.details.map((el) => el.message);
      return next(new AppError(errors, 400));
    }

    const { name, email, phoneNumber, location } = value;
    const userId = req.user.id; // Assuming user ID is available in req.user

    // Find and update user profile
    let updatedUser = await user_model.findByIdAndUpdate(
      userId,
      { name, email, phoneNumber, location },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return next(new AppError("User not found", 404));
    }

    // Remove sensitive data before sending response
    updatedUser = JSON.parse(JSON.stringify(updatedUser));
    updatedUser.password = undefined;
    updatedUser.refreshToken = undefined;

    return successMessage(
      200,
      res,
      "Profile updated successfully",
      updatedUser
    );
  })


module.exports = {
  signUpUser,
  loginUser,
  verifyOTP,
  updateProfile
};
