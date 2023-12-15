const ExpressError = require("../utils/ExpressError");
const { productSchema, reviewSchema } = require("../validation/joiSchema");

module.exports.productValidation = (req, res, next) => {
  const product = req.body;
  const result = productSchema.validate({ product });
  if (result.error) {
    // ADD FLASH HERE
    const msg = result.error.details.map((detail) => detail.message).join(",");
    return next(new ExpressError(400, msg));
  }
  return next();
};

// Validate is everything okay in requested review
module.exports.reviewValidation = (req, res, next) => {
  const review = req.body;
  const result = reviewSchema.validate({ review });
  console.log(result);
  if (result.error) {
    const msg = result.error.details.map((detail) => detail.message).join(",");
    return next(new ExpressError(400, msg));
  }
  return next();
};
