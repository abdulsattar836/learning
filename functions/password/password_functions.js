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
//validate password
const {
  validatePassword,
} = require("../../utils/validation/validate password");

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
      await new sendForgotOtp(email, sixDigitNumber).sendVerificationCode();
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
// const setPassword = (model) =>
//   catchAsync(async (req, res, next) => {
//     const { email, encryptOpts, otp, newPassword } = req.body;
//     const check = validatePassword(newPassword);
//     if (check.length > 0) {
//       return next(new AppError(check, 400));
//     }
//     const errors = [];

//     if (!email) {
//       errors.push("Email is required.");
//     }

//     if (!otp) {
//       errors.push("Verification code is required.");
//     }

//     if (errors.length > 0) {
//       return next(new AppError(errors, 400));
//     }

//     // Decrypt the encrypted options and compare with the user-entered code
//     const decrypted = CryptoJS.AES.decrypt(
//       decodeURIComponent(encryptOpts),
//       process.env.CRYPTO_SEC
//     ).toString(CryptoJS.enc.Utf8);

//     let otpData;
//     try {
//       otpData = JSON.parse(decrypted);
//     } catch (error) {
//       return next(new AppError("Invalid encrypted options format.", 400));
//     }

//     const { code, expirationTime } = otpData;

//     if (code != otp) {
//       return next(new AppError("Invalid verification code.", 400));
//     }

//     // Check if the OTP has expired
//     const currentTime = new Date().getTime();
//     if (currentTime > expirationTime) {
//       return next(new AppError("Verification code has expired.", 400));
//     }

//     // console.log(model)
//     // Find the user by email
//     const user = await model.findOne({ email });
//     if (!user) {
//       return next(new AppError("User not found.", 400));
//     }
//     if (!user.forgetPassword) {
//       return next(new AppError("Unable to change password without OTP", 400));
//     }
//     if (encryptOpts != user.forgetPassword) {
//       new AppError("generate otp first", 400);
//     }
//     // Update the user's password
//     user.password = CryptoJS.AES.encrypt(
//       newPassword,
//       process.env.CRYPTO_SEC
//     ).toString();
//     user.forgetPassword = null;
//     await user.save();
//     return successMessage(202, res, "Password reset successfully.", null);
//   });

const setPassword = (model) =>
  catchAsync(async (req, res, next) => {
    const { email, currentPassword, newPassword } =
      req.body;
    const check = validatePassword(newPassword);

    if (check.length > 0) {
      return next(new AppError(check, 400));
    }

    const errors = [];

    if (!email) {
      errors.push("Email is required.");
    }

  

    if (errors.length > 0) {
      return next(new AppError(errors, 400));
    }

    // Find the user (assuming user information is available in req.user)
        const user = await model.findOne({ email });
        if (!user) {
          return next(new AppError("User not found.", 400));
        }

    // Check old password
    const decryptedcurrentPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.CRYPTO_SEC
    ).toString(CryptoJS.enc.Utf8);

    if (decryptedcurrentPassword !== currentPassword) {
      return next(new AppError(" currentPassword is incorrect.", 400));
    }

    // Update the user's password
    user.password = CryptoJS.AES.encrypt(
      newPassword,
      process.env.CRYPTO_SEC
    ).toString();
    await user.save();

    return successMessage(202, res, "Password reset successfully.", null);
  });


module.exports = {
  userPasswordCheck,
  forgetPassword,
  setPassword,
};
