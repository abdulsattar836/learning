const Joi = require("joi");

// signup vendor validation
const signupVendorValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  companyName: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  password: Joi.string().required(),
}).options({
  abortEarly: false,
});

module.exports = {
  signupVendorValidation,
};
