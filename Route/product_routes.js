// define route
const express = require("express");
const ROUTE = express.Router();
// model
const vendor_model = require("../Model/vendor_model");
//controllers
const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
} = require("../Controller/product_controller");
// auth
const { verifyToken } = require("../utils/verifyToken_util");
// multer
const upload  = require("../multer/multer");

/**
 * @swagger
 * /api/v1/product/:
 *   post:
 *     summary: Create a new product
 *     description: Create a new product with the specified details
 *     tags:
 *       - Vendor/Product
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ProductImage:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of product image URLs
 *                 example: ["http://example.com/image1.jpg"]
 *               ProductName:
 *                 type: string
 *                 description: Name of the product
 *                 example: "Sample Product"
 *               ProductPrice:
 *                 type: number
 *                 description: Price of the product
 *                 example: 99.99
 *               StockQuantity:
 *                 type: number
 *                 description: Quantity of the product in stock
 *                 example: 10
 *               ProductDescription:
 *                 type: string
 *                 description: Description of the product
 *                 example: "This is a sample product."
 *               SelectStatus:
 *                 type: boolean
 *                 description: Status of the product selection
 *                 example: true
 *     responses:
 *       202:
 *         description: Product added successfully
 */
ROUTE.route("/").post(verifyToken([vendor_model]), createProduct);

/**
 * @swagger
 * /api/v1/product/:
 *   get:
 *     summary: Retrieve all products
 *     description: Retrieve all products from the database
 *     tags:
 *       - Vendor/Product
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       202:
 *         description: Successfully retrieved all products

 */
ROUTE.route("/").get(verifyToken([vendor_model]), getProducts);

/**
 * @swagger
 * /api/v1/product/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieve a product by its ID.
 *     tags:
 *       - Vendor/Product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to retrieve.
 *     responses:
 *       202:
 *         description: Successfully retrieved the product
 */

ROUTE.route("/:id").get(verifyToken([vendor_model]), getProduct);
/**
 * @swagger
 * /api/v1/product/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Delete a product by its ID. The product must belong to the authenticated vendor.
 *     tags:
 *       - Vendor/Product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to delete
 *     responses:
 *       202:
 *         description: Product deleted successfully
 */
ROUTE.route("/:id").delete(verifyToken([vendor_model]), deleteProduct);

/**
 * @swagger
 * /api/v1/product/{id}:
 *   put:
 *     summary: Update a product by ID
 *     description: Update product details and image by product ID and vendor ID.
 *     tags:
 *       - Vendor/Product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ProductImage:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: An array of product image URLs
 *                 example: ["image1.jpg"]
 *               ProductName:
 *                 type: string
 *                 description: Name of the product
 *                 example: "Sample Product"
 *               ProductPrice:
 *                 type: number
 *                 description: Price of the product
 *                 example: 19.99
 *               StockQuantity:
 *                 type: number
 *                 description: Quantity of the product in stock
 *                 example: 100
 *               ProductDescription:
 *                 type: string
 *                 description: Description of the product
 *                 example: "This is a sample product description."
 *               SelectStatus:
 *                 type: boolean
 *                 description: Status of the product
 *                 example: true
 *     responses:
 *       202:
 *         description: Product updated
 */

ROUTE.route("/:id").put(
  verifyToken([vendor_model]),
  upload,
  updateProduct,
);

module.exports = ROUTE;
