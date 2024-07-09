// define route
const express = require("express");
const ROUTE = express.Router();
// controller
const {
  uploadFileWithoutToken,
} = require("../Controller/WithoutToken_controller");
// multer
const upload = require("../multer/multer");
// authorization
// const { verifyToken } = require("../utils/verifyToken_util");

/**
 * @swagger
 * /api/v1/WithoutToken/uploadfile:
 *   post:
 *     summary: Upload a file without a token
 *     tags:
 *       - WithoutToken/upload
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
 *         description: Successfully uploaded the file
 */

ROUTE.route("/uploadfile").post(upload, uploadFileWithoutToken);

module.exports = ROUTE;
