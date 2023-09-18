const Product = require("../models/product");
const ExpressError = require("../utils/ExpressError");

module.exports.productAuthorize = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (req.session.currentUser._id === product.seller.valueOf()) {
    return next();
  }
  return next(
    new ExpressError(400, "You are not authorized to do that operation")
  );
};
