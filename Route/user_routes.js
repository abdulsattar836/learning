// define route
const express = require("express");
const ROUTE = express.Router();
// model
const user_model = require("../Model/user_model");
// controller
const {
  signUpUser,
  loginUser,
  verifyOTP,
  updateProfile,
} = require("../Controller/user_controller");
const { logout } = require("../functions/user/user_functions");
const {
  forgetPassword,
  setPassword,
} = require("../functions/password/password_functions");
const { otpValidation, refreshToken, verifyToken } = require("../utils/verifyToken_util");
// const { verifyToken } = require("../utils/verifyToken_util");
/**
 * @swagger
 * /api/v1/user/signup:
 *   post:
 *     summary: User sign-up
 *     description: Sign up a new user and send OTP for email verification. If the user is already signed up but not verified, resend the OTP.
 *     tags:
 *       - User/account
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
 *                 description: User's name
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: User's email
 *                 example: johndoe@example.com
 *               phoneNumber:
 *                 type: string
 *                 description: User's phone number
 *                 example: "+1234567890"
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: "securepassword123"
 *               location:
 *                 type: object
 *                 description: User's location
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [Point]
 *                     description: Type of location, must be 'Point'
 *                     example: Point
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     description: Coordinates [longitude, latitude]
 *                     example: [-73.856077, 40.848447]
 *             required:
 *               - name
 *               - email
 *               - phoneNumber
 *               - password
 *     responses:
 *       202:
 *         description: Sign-up successful, please verify your email
 */
ROUTE.route("/signup").post(signUpUser);

/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: Log in a user
 *     tags:
 *       - User/account
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
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: "securepassword123"
 *                 description: The user's password.
 *     responses:
 *       202:
 *         description: Login successfulk
 */
ROUTE.route("/login").post(loginUser);

/**
 * @swagger
 * /api/v1/user/logout:
 *   post:
 *     summary: Log out a user
 *     description: Removes the refresh token from the user's record to log them out.
 *     tags:
 *       - User/account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       202:
 *         description: Logout successful
 */

ROUTE.route("/logout").post(logout(user_model));

/**
 * @swagger
 * /api/v1/user/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     description: Verifies the OTP for user email verification
 *     tags:
 *       - User/account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Email verified successfully
 */
ROUTE.route("/verify-otp").post(verifyOTP);

/**
 * @swagger
 * /api/v1/user/refresh-token:
 *   post:
 *     summary: Refresh the access token
 *     description: Generates a new access token using a valid refresh token.
 *     tags:
 *       - User/account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       202:
 *         description: Refresh token processed successfully
 */

ROUTE.route("/refresh-token").post(refreshToken(user_model));

/**
 * @swagger
 * /api/v1/user/forget-password:
 *   get:
 *     summary: Request password reset
 *     description: Sends an OTP to the user's email for password reset.
 *     tags:
 *       - User/account
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         description: Email of the user requesting password reset.
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: OTP sent successfully
 */
ROUTE.route("/forget-password").get(forgetPassword(user_model));

/**
 * @swagger
 * /api/v1/user/setpassword:
 *   post:
 *     summary: Reset user password
 *     description: Allows users to reset their password by providing their email, old password, and a new password.
 *     tags:
 *       - User/account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *               currentPassword:
 *                 type: string
 *                 description: The user's current password.
 *               newPassword:
 *                 type: string
 *                 description: The new password the user wants to set.
 *     responses:
 *       202:
 *         description: Password reset successfully.
 */

ROUTE.route("/setpassword").post(setPassword(user_model));



/**
 * @swagger
 * /api/v1/user/profile:
 *   put:
 *     summary: Update user profile
 *     description: Update the user's profile information.
 *     tags:
 *       - User/account
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
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               phoneNumber:
 *                 type: string
 *                 example: "+1234567890"
 *               location:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: ["Point"]
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     example: [40.712776, -74.005974]
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
ROUTE.route("/profile").put(verifyToken([user_model]), updateProfile);

module.exports = ROUTE;
