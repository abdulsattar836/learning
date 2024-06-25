// successMessage
const { successMessage } = require("../success/success_functions");
// appError
const AppError = require("../../utils/appError");
// catchAsync
const catchAsync = require("../../utils/catchAsync");
// forgetPassword
const sendForgotOtp = require("../../utils/email Sender/forgot_passwordEmail");
// cryptoJs
const CryptoJS = require("crypto-js");

// userPasswordCheck
const userPasswordCheck = (user, password) => {
  // this package for encryption
  const CryptoJS = require("crypto-js");
  const hashedPassword = CryptoJS.AES.decrypt(
    user.password,
    process.env.CRYPTO_SEC
  );
  const realPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
  if (password !== realPassword) {
    throw new AppError("password is incorrect", 400);
  }
};
// forgetPassword
const forgetPassword = (model) =>
  catchAsync(async (req, res, next) => {
    const { email } = req.query;
    const user = await model.findOne({ email });
    if (user) {
      function generateSixDigitNumber() {
        const min = 100000; // Smallest 6-digit number
        const max = 999999; // Largest 6-digit number
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      const sixDigitNumber = generateSixDigitNumber();
      const expirationTime = new Date().getTime() + 5 * 60 * 1000; // 5 minutes expiration
      await new sendForgotOtp( email , sixDigitNumber).sendVerificationCode();
      let otp = CryptoJS.AES.encrypt(
        JSON.stringify({
          code: sixDigitNumber,
          expirationTime: expirationTime,
        }),
        process.env.CRYPTO_SEC
      ).toString();
      user.forgetPassword = encodeURIComponent(otp);
      await user.save();
      return successMessage(202, res, null, {
        email,
        otp: encodeURIComponent(otp),
      });
    } else {
      return next(new AppError("not user with this email", 400));
    }
  });
// setPassword
const setPassword = async (req, res, next) => {
  try {
    const { email, encryptOpts, otp, newPassword } = req.body;
    const check = validatePassword(newPassword);
    if (check.length > 0) {
      return next(new AppError(check, StatusCodes.BAD_REQUEST));
    }
    const errors = [];

    if (!email) {
      errors.push("Email is required.");
    }

    if (!otp) {
      errors.push("Verification code is required.");
    }

    if (errors.length > 0) {
      return next(new AppError(errors, StatusCodes.BAD_REQUEST));
    }

    // Decrypt the encrypted options and compare with the user-entered code
    const decrypted = CryptoJS.AES.decrypt(
      decodeURIComponent(encryptOpts),
      process.env.CRYPTO_SEC
    ).toString(CryptoJS.enc.Utf8);

    let otpData;
    try {
      otpData = JSON.parse(decrypted);
    } catch (error) {
      return next(
        new AppError(
          "Invalid encrypted options format.",
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const { code, expirationTime } = otpData;

    if (code != otp) {
      return next(
        new AppError("Invalid verification code.", StatusCodes.BAD_REQUEST)
      );
    }

    // Check if the OTP has expired
    const currentTime = new Date().getTime();
    if (currentTime > expirationTime) {
      return next(
        new AppError("Verification code has expired.", StatusCodes.BAD_REQUEST)
      );
    }
    // Find the user by email
    const user = await model.findOne({ email });

    if (!user) {
      return next(new AppError("User not found.", StatusCodes.NOT_FOUND));
    }
    if (!user.forgetPassword) {
      return next(
        new AppError(
          "Unable to change password without OTP",
          StatusCodes.NOT_FOUND
        )
      );
    }
    if (encryptOpts != user.forgetPassword) {
      new AppError("generate otp first", StatusCodes.NOT_FOUND);
    }
    // Update the user's password
    user.password = CryptoJS.AES.encrypt(
      newPassword,
      process.env.CRYPTO_SEC
    ).toString();
    user.forgetPassword = null;
    await user.save();
    return successMessage(
      StatusCodes.ACCEPTED,
      res,
      "Password reset successfully.",
      null
    );
  } catch (error) {
    return next(new AppError(error, StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

module.exports = {
  userPasswordCheck,
  forgetPassword,
};
