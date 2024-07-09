// define route
const express = require("express");
const ROUTE = express.Router();

// controller
const {
  WithoutTokencreateProduct,
} = require("../Controller/WithoutTokenProduct_controller");

/**
 * @swagger
 * /api/v1/WithoutTokenProduct/createproduct:
 *   post:
 *     summary: Create a new product (without token)
 *     tags:
 *       - WithoutToken/Product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vendorId:
 *                 type: string
 *                 description: ID of the vendor creating the product
 *               ProductImage:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: URLs or paths of product images
 *               ProductName:
 *                 type: string
 *                 description: Name of the product
 *               ProductPrice:
 *                 type: number
 *                 description: Price of the product
 *               StockQuantity:
 *                 type: number
 *                 description: Quantity of the product in stock
 *               ProductDescription:
 *                 type: string
 *                 description: Description of the product
 *               SelectStatus:
 *                 type: boolean
 *                 description: Status of the product (active/inactive)
 *     responses:
 *       202:
 *         description: Product added successfully
 */
ROUTE.route("/createproduct").post(WithoutTokencreateProduct);
module.exports = ROUTE;
