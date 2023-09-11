const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = Schema({
  image: {
    type: String,
  },
  title: String,
  price: Number,
  seller: String,
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
