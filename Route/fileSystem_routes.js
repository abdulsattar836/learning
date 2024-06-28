// define route
const express = require("express");
const ROUTE = express.Router();
// model
const vendor_model = require("../Model/vendor_model");
// controller
const { uploadFile } = require("../Controller/fileSystem_controller");
// multer
const upload = require("../multer/multer");
// authorization
const { verifyToken } = require("../utils/verifyToken_util");

// routes

/**
 * @swagger
 * /api/v1/file/:
 *   post:
 *     summary: Upload a file
 *     description: Endpoint for vendors to upload a file.
 *     tags:
 *       - file/upload
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       202:
 *         description: Successfully uploaded file
 */
ROUTE.route("/").post(verifyToken([vendor_model]), upload, uploadFile);

module.exports = ROUTE;
