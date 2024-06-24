// define route
const express = require("express");
const ROUTE = express.Router();

// controller
const {
  signUpVendor,
  loginVendor,
} = require("../Controller/vendor_controller");

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

module.exports = ROUTE;
