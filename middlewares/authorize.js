const Product = require("../models/product");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");

// Check weather user logged in or not for changing or deleting a product
module.exports.productAuthorize = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (
    req.session.currentUser &&
    req.session.currentUser._id === product.seller.valueOf()
  ) {
    return next();
  }
  return next(
    new ExpressError(400, "You are not authorized to do that operation")
  );
};

// Check weather user logged in or not for adding new product
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    // ADD FLASH
    res.redirect("/login");
  }
  next();
};

module.exports.reviewAuthorize = async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);
  if (
    req.session.currentUser &&
    req.session.currentUser._id === review.author._id.valueOf()
  ) {
    return next();
  }
  return next(
    new ExpressError(400, "You are not authorized to do that operation")
  );
};
