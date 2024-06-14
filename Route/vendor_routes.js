// define route
const express = require("express");
const ROUTE = express.Router();

// controller
const { signUpVendor } = require("../Controller/vendor_controller");

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

module.exports = ROUTE;
