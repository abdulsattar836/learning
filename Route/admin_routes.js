// define route
const express = require("express");
const ROUTE = express.Router();
// model
const admin_model = require("../Model/admin_model");
// controller
const { loginAdmin, logoutAdmin } = require("../Controller/admin_controllers");
const {
  forgetPassword,
  setPassword,
} = require("../functions/password/password_functions");
const { otpValidation, refreshToken } = require("../utils/verifyToken_util");

/**
 * @swagger
 * /api/v1/admin/login:
 *   post:
 *     summary: Admin login
 *     description: This endpoint allows admins to log in.
 *     tags:
 *       - Admin/account
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: yourpassword
 *     responses:
 *       202:
 *         description: Successfully logged in
 */
ROUTE.route("/login").post(loginAdmin);

/**
 * @swagger
 * /api/v1/admin/logout:
 *   post:
 *     summary: Admin logout
 *     description: This endpoint allows admins to log out by invalidating their refresh token.
 *     tags:
 *       - Admin/account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       202:
 *         description: Successfully logged out
 */
ROUTE.route("/logout").post(logoutAdmin(admin_model));
/**
 * @swagger
 * /api/v1/admin/refreshtoken:
 *   post:
 *     summary: Refresh the access token
 *     description: This endpoint allows vendors to refresh their access token using a valid refresh token.
 *     tags:
 *       - Admin/account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       202:
 *         description: Successfully refreshed the access token
 */
ROUTE.route("/refreshtoken").post(refreshToken(admin_model));

/**
 * @swagger
 * /api/v1/admin/forgetPassword:
 *   get:
 *     summary: Send OTP for password reset
 *     description: Generates a six-digit OTP and sends it to the user's email for password reset. The OTP is valid for 5 minutes.
 *     tags:
 *       - Admin/account
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
ROUTE.route("/forgetpassword").get(forgetPassword(admin_model));

/**
 * @swagger
 *  /api/v1/admin/otp-validation:
 *   get:
 *     summary: Validate OTP
 *     description: Validate the provided OTP against the decrypted options.
 *     tags:
 *       - Admin/account
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
 * /api/v1/admin/set-password:
 *   post:
 *     summary: Set a new password
 *     description: Set a new password for the user after validating the OTP.
 *     tags:
 *       - Admin/account
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
ROUTE.route("/set-password").post(setPassword(admin_model));

module.exports = ROUTE;
