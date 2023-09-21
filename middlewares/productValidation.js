const ExpressError = require("../utils/ExpressError");
const { productSchema } = require("../validation/joiSchema");

const productValidation = (req, res, next) => {
  const product = req.body;
  const result = productSchema.validate({ product });
  if (result.error) {
    // ADD FLASH HERE
    next(new ExpressError(400, result.error.details[0].message));
  }
  next();
  console.dir(productSchema.validate({ product }).error);
};

module.exports = productValidation;
