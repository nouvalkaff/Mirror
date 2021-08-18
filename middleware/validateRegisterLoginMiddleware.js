const Joi = require("joi");

exports.registerValidation = (data) => {
  const registerSchema = Joi.object({
    full_name: Joi.string().required(),
    username: Joi.string().alphanum().min(4).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .max(30)
      // .pattern(/^[a-zA-Z0-9!@#$&()`.+,/"-]*$/)
      .required(),
  }).unknown();
  const { joiError } = registerSchema.validateAsync(data);

  if (joiError) {
    return joiError;
  }
};

exports.loginValidation = (data) => {
  const loginSchema = Joi.object({
    username: Joi.string().alphanum().min(4).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .max(30)
      // .pattern(/^[a-zA-Z0-9!@#$&()`.+,/"-]*$/)
      .required(),
  }).or("Username", "Email");

  return loginSchema.validateAsync(data);
};

exports.registerSchema = Joi.object({
  full_name: Joi.string().required(),
  username: Joi.string().alphanum().min(4).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(30)
    // .pattern(/^[a-zA-Z0-9!@#$&()`.+,/"-]*$/)
    .required(),
}).unknown();

exports.loginSchema = Joi.object({
  // username: Joi
  // 	.string()
  // 	.alphanum()
  // 	.min(4)
  // 	.max(20)
  // 	.required(),
  // email: Joi
  // 	.string()
  // 	.email()
  // 	.required(),
  password: Joi.string()
    .min(8)
    .max(30)
    // .pattern(/^[a-zA-Z0-9!@#$&()`.+,/"-]*$/)
    .required(),
}).unknown();
// .or('username', 'email')
