const mongoose = require("mongoose");
const Product = require("../models/product");
const User = require("../models/user");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/e-commerce-web-app");
}

const newProducts = [];

async function loadData() {
  await Product.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const randNum = Math.floor(Math.random() * 15) + 1;
    const product = new Product({
      title: "lipstick",
      price: randNum,
      seller: "65572dcb223f2ee6d1a714d0",
      imageUrl:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    });
    console.log(product);
    newProducts.push(product);
  }
  return await Product.insertMany(newProducts);
}

async function ridOfUsers() {
  await User.deleteMany({});
}

loadData();
