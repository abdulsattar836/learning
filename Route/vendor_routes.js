// define route
const express = require("express");
const ROUTE = express.Router();
// model
const vendor_model = require("../Model/vendor_model");
// controller
const {
  signUpVendor,
  loginVendor,
} = require("../Controller/vendor_controller");
const { logout } = require("../functions/user/user_functions");
const {
  forgetPassword,
  setPassword,
} = require("../functions/password/password_functions");
const { otpValidation } = require("../utils/verifyToken_util");

// routes

/**
 * @swagger
 * /api/v1/vendor/signup:
 *   post:
 *     summary: Signup a vendor
 *     description: Endpoint to register a new vendor.
 *     tags:
 *       - Vendor/account
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               companyName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '202':
 *         description: Signup success
 */
ROUTE.route("/signup").post(signUpVendor);

/**
 * @swagger
 * /api/v1/vendor/login:
 *   post:
 *     summary: Vendor login
 *     description: Endpoint for vendor login
 *     tags:
 *       - Vendor/account
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: Vendor's email address
 *                 example: vendor@example.com
 *               password:
 *                 type: string
 *                 description: Vendor's password
 *                 example: password123
 *     responses:
 *       202:
 *         description: Login successfull
 */
ROUTE.route("/login").post(loginVendor);

/**
 * @swagger
 * /api/v1/vendor/logout:
 *   post:
 *     summary: Logout user
 *     description: Invalidate the user's refresh token to log them out.
 *     tags:
 *       - Vendor/account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       202:
 *         description: Logout successfully
 */
ROUTE.route("/logout").post(logout(vendor_model));

/**
 * @swagger
 * /api/v1/vendor/forgetPassword:
 *   get:
 *     summary: Send OTP for password reset
 *     description: Generates a six-digit OTP and sends it to the user's email for password reset. The OTP is valid for 5 minutes.
 *     tags:
 *       - Vendor/account
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         description: The email address of the user who wants to reset their password.
 *         schema:
 *           type: string
 *           example: "user@example.com"
 *     responses:
 *       202:
 *         description: OTP sent successfully
 */
ROUTE.route("/forgetPassword").get(forgetPassword(vendor_model));

/**
 * @swagger
 *  /api/v1/vendor/otp-validation:
 *   get:
 *     summary: Validate OTP
 *     description: Validate the provided OTP against the decrypted options.
 *     tags:
 *       - Vendor/account
 *     parameters:
 *       - in: query
 *         name: otp
 *         required: true
 *         schema:
 *           type: string
 *         description: The OTP entered by the user.
 *       - in: query
 *         name: encryptOpts
 *         required: true
 *         schema:
 *           type: string
 *         description: The encrypted options containing the OTP and expiration time.
 *     responses:
 *       202:
 *         description: Correct OTP
 */
ROUTE.route("/otp-validation").get(otpValidation);

/**
 * @swagger
 * /api/v1/vendor/set-password:
 *   post:
 *     summary: Set a new password
 *     description: Set a new password for the user after validating the OTP.
 *     tags:
 *       - Vendor/account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - encryptOpts
 *               - otp
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *               encryptOpts:
 *                 type: string
 *                 description: The encrypted options containing the OTP and expiration time.
 *               otp:
 *                 type: string
 *                 description: The OTP entered by the user.
 *               newPassword:
 *                 type: string
 *                 description: The new password to be set for the user.
 *     responses:
 *       202:
 *         description: Password reset successfully.
 */
ROUTE.route("/set-password").post(setPassword(vendor_model));

module.exports = ROUTE;
