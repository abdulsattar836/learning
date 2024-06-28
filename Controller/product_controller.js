// app error
const AppError = require("../utils/appError");
// model
const product_model = require("../Model/product_model");
// password encryption
// const CryptoJS = require("crypto-js");
// utility functions
const { successMessage } = require("../functions/success/success_functions");
// catchAsync
const catchAsync = require("../utils/catchAsync");
// validation
const {
  productSchemaJoi,
  UpdateProductSchemaJoi,
} = require("../utils/validation/product_joi_validation");
//file Extension and Deleted
const {
  fileExistsSync,
  deleteFile,
} = require("../functions/forFiles/forFiles_functions");

// method POST
// route /api/v1/product/
// @desciption for create Product
const createProduct = catchAsync(async (req, res, next) => {
  // Validate the request body against the schema
  const { error, value } = productSchemaJoi.validate(req.body);

  if (error) {
    const errors = error.details.map((el) => el.message);
    return next(new AppError(errors, 400));
  }
  if (!fileExistsSync(value.ProductImage[0])) {
    return next(new AppError("Product Image not found", 400));
  }
  const productWithProductImageInDatabase = await product_model.findOne({
    ProductImage: value.ProductImage[0],
  });
  if (productWithProductImageInDatabase) {
    return next(new AppError("Product Image already exists", 400));
  }
  // Create the product
  const product = await product_model.create({
    vendorId: req.user.id,
    ...value,
  });
  successMessage(202, res, "product added success", product);
});

// method GET
// route /api/v1/product/
// @desciption for get all product
const getProducts = catchAsync(async (req, res, next) => {
  const products = await product_model.find({
    vendorId: req.user.id,
  });
  successMessage(202, res, "get all Product", products);
});

// method DELETE
// route /api/v1/product/:id
// @desciption for delete product
const deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await product_model.findByIdAndDelete(
    id,
    {
      vendorId: req.user.id,
    },
    {
      new: true,
    }
  );
  if (!product) {
    return next(new AppError("No product found with that ID", 400));
  }
  successMessage(202, res, "Product deleted", null);
});

// method PUT
// route /api/v1/product/:id
// @desciption for update product
const updateProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  // Validate request body
  const { error, value } = UpdateProductSchemaJoi.validate(req.body);
  if (error) {
    const errors = error.details.map((el) => el.message);
    return next(new AppError(errors, 400));
  }
  // Check for existing product by ID and vendor ID
  const product = await product_model.findOne({
    _id: id,
    vendorId: req.user.id,
  });
  if (!product) {
    return next(new AppError("No product found with that ID", 400));
  }

  // Check for existing product image
  if (value.ProductImage[0]) {
    const ProductImageInDatabase = await product_model.findOne({
      ProductImage: value.ProductImage[0],
    });
    if (
      ProductImageInDatabase &&
      !(req.user.id == ProductImageInDatabase.vendorId)
    ) {
      return next(new AppError("Product Image already exists", 400));
    }
  }

  // Update product details and image
  if (value.ProductImage[0] !== product.ProductImage[0]) {
    if (!fileExistsSync(value.ProductImage[0])) {
      return next(new AppError("Product Image does not exist", 400));
    }
  }

  const updatedProduct = await product_model.findOneAndUpdate(
    { _id: id, vendorId: req.user.id },
    {
      ...value,
    },
    {
      new: true,
    }
  );

  if (updatedProduct.ProductImage[0] !== product.ProductImage[0]) {
    await deleteFile(product.ProductImage[0]);
  }
  successMessage(202, res, "Product updated", updatedProduct);
});

module.exports = {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
};
