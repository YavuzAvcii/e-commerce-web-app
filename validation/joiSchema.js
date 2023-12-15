const Joi = require("joi");

module.exports.productSchema = Joi.object({
  product: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required(),
    image: Joi.string(),
  }).required(),
}).required();

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    text: Joi.string(),
    rating: Joi.number().required(),
  }),
});

// module.exports.userSchema = Joi.object({
//   user: Joi.object({
//     username: Joi.string().required(),

//   })
// })
