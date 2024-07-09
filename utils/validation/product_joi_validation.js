const Joi = require("joi");
const productSchemaJoi = Joi.object({
  ProductImage: Joi.array().items(Joi.string().min(1).required()).required(),
  ProductName: Joi.string().required(),
  ProductPrice: Joi.number().required(),
  StockQuantity: Joi.number().required(),
  ProductDescription: Joi.string().required(),
  SelectStatus: Joi.boolean().default(true),
});

const UpdateProductSchemaJoi = Joi.object({
  ProductImage: Joi.array().items(Joi.string().min(1).required()).required(),
  ProductName: Joi.string().required(),
  ProductPrice: Joi.number().required(),
  StockQuantity: Joi.number().required(),
  ProductDescription: Joi.string().required(),
  SelectStatus: Joi.boolean().default(true),
});

const WithoutTokenproductSchemaJoi = Joi.object({
  vendorId: Joi.string().required(),
  ProductImage: Joi.array().items(Joi.string().min(1).required()).required(),
  ProductName: Joi.string().required(),
  ProductPrice: Joi.number().required(),
  StockQuantity: Joi.number().required(),
  ProductDescription: Joi.string().required(),
  SelectStatus: Joi.boolean().default(true),
});
module.exports = {
  productSchemaJoi,
  UpdateProductSchemaJoi,
  WithoutTokenproductSchemaJoi,
};
