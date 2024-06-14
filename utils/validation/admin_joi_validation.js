const Joi = require("joi");

// login admin validation
const loginAdminValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).options({ abortEarly: false });

module.exports = {
  loginAdminValidation,
};
