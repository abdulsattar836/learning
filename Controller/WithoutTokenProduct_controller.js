
// app error
const AppError = require("../utils/appError");// catch
const catchAsync = require("../utils/catchAsync");
// success
const { successMessage } = require("../functions/success/success_functions");
//model
const product_model = require("../Model/product_model");
//joi validation
const {
  WithoutTokenproductSchemaJoi,
} = require("../utils/validation/product_joi_validation");
//file Extension and Deleted
const { fileExistsSync } = require("../functions/forFiles/forFiles_functions");

const WithoutTokencreateProduct = catchAsync(async (req, res, next) => {
  // Validate the request body against the schema
  const { error, value } = WithoutTokenproductSchemaJoi.validate(req.body);

  if (error) {
    const errors = error.details.map((el) => el.message);
    return next(new AppError(errors, 400));
  }
  if (!fileExistsSync(value.ProductImage[0])) {
    return next(new AppError("Product Image not found", 400));
  }
  const ProductImageInDatabase = await product_model.findOne({
    ProductImage: value.ProductImage[0],
  });
  if (ProductImageInDatabase) {
    return next(new AppError("Product Image already exists", 400));
  }
    // Create the product
  const product = await product_model.create({
    vendorId:req.body,
     ...value,
  });
  successMessage(202, res, "product added success", product);
});

module.exports = {
  WithoutTokencreateProduct,
};
