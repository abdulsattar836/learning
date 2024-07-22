const Joi = require("joi");

const signupUserValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  password: Joi.string().required(),
  location: Joi.object({
    type: Joi.string().valid("Point").required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
  }).allow(null),
  isVerified: Joi.boolean().default(false),
  otp: Joi.string().allow(null),
});

const loginUserValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  isBlock: Joi.boolean().optional(),
});

const updateprofileValidation = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().required(),
  phoneNumber: Joi.string().optional(),
  location: Joi.object({
    type: Joi.string().valid("Point").required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
  }),
});

module.exports = {
  signupUserValidation,
  loginUserValidation,
  updateprofileValidation,
};
