const express = require("express");
const Product = require("../models/product");
const { isLoggedIn, reviewAuthorize } = require("../middlewares/authorize");
const { reviewValidation } = require("../middlewares/validation");
const catchAsyncErr = require("../utils/catchAsyncErr");
const Review = require("../models/review");

const router = express.Router();

router.post(
  "/:id/reviews",
  isLoggedIn,
  reviewValidation,
  catchAsyncErr(async (req, res) => {
    const { id } = req.params;
    const review = new Review(req.body);
    const product = await Product.findById(id);
    review.author = req.session.currentUser;
    product.reviews.push(review);
    if (!review.rating) {
      throw new ExpressError(400, "Rating can not be empty!");
    }
    console.log(review.rating);
    review.save();
    product.save();
    res.redirect(`/products/${id}`);
  })
);

// Open Edit reivew form
router.get(
  "/:id/reviews/:reviewId",
  catchAsyncErr(async (req, res) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    const product = await Product.findById(id);

    res.render("products/reviewEdit", { review, product });
  })
);

// Edit review
router.put(
  "/:id/reviews/:reviewId",
  reviewAuthorize,
  // reviewValidation should be added
  catchAsyncErr(async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndUpdate(reviewId, req.body);
    res.redirect(`/products/${id}`);
  })
);

router.delete(
  "/:id/reviews/:reviewId",
  reviewAuthorize,
  catchAsyncErr(async (req, res) => {
    const { id, reviewId } = req.params;
    const product = await Product.findById(id);

    await Review.findByIdAndDelete(reviewId);

    product.reviews = product.reviews.filter(
      (review) => review.toString() !== reviewId
    );
    product.save();
    res.redirect(`/products/${id}`);
  })
);

module.exports = router;
