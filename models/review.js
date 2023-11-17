const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: String,
  rating: {
    type: Number,
    required: true,
  },
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
