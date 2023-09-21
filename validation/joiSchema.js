const Joi = require("joi");

module.exports.productSchema = Joi.object({
  product: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required(),
    image: Joi.string(),
  }).required(),
}).required();

module.exports.reviewSchema = Joi.object({});
