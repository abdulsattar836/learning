// define route
const express = require("express");
const ROUTE = express.Router();
// model
const admin_model = require("../Model/admin_model");
// controller
const {BlockedandunBlockedVendor} = require("../Controller/blockedandunblockedvendor_controller");

const { verifyToken } = require("../utils/verifyToken_util");

/**
 * @swagger
 * /api/v1/blockandunblock/{id}:
 *   get:
 *     summary: block un block vendor
 *     description: Retrieve a vendor by ID. This endpoint is for admin use to check if a vendor is blocked or not.
 *     tags:
 *       - blockandunblock/Vendor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The vendor ID
 *     responses:
 *       200:
 *         description: success
 */

ROUTE.route('/:id').get( verifyToken([admin_model]),BlockedandunBlockedVendor);

module.exports = ROUTE;
