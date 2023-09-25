const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
