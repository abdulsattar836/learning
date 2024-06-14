const AppError = require("../../utils/appError");

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

module.exports = {
  userPasswordCheck,
};
