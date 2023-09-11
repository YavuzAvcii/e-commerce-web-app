const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const catchAsyncErr = require("./utils/catchAsyncErr");
const Product = require("./models/product");
const Review = require("./models/review");
const User = require("./models/user");
const ExpressError = require("./utils/ExpressError");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/e-commerce-web-app");
}

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// product routes
app.get(
  "/products",
  catchAsyncErr(async (req, res, next) => {
    const products = await Product.find({});
    res.render("products/index", { products });
  })
);

app.get("/products/new", (req, res) => {
  res.render("products/new.ejs");
});

app.post(
  "/products",
  catchAsyncErr(async (req, res, next) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect("/products");
  })
);

app.get(
  "/products/:id",
  catchAsyncErr(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      throw new ExpressError(400, "Product could not found");
    }
    res.render("products/show.ejs", { product });
  })
);

app.get(
  "/products/:id/edit",
  catchAsyncErr(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      throw new ExpressError(400, "Product could not found");
    }
    res.render("products/edit", { product });
  })
);

app.put(
  "/products/:id",
  catchAsyncErr(async (req, res, next) => {
    const { id } = req.params;
    await Product.findByIdAndUpdate(id, req.body);
    res.redirect(`/products/${id}`);
  })
);

app.delete(
  "/products/:id",
  catchAsyncErr(async (req, res, next) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect("/products");
  })
);

// review routes
app.post("/products/:productsId/reviews", (req, res) => {
  res.send("create new review");
});

app.delete("products/:productsId/reviews/:reviewId", (req, res) => {
  res.send("delete review");
});

// user routes
app.post("/register", (req, res) => {
  res.send("register request");
});

app.post("/login", (req, res) => {
  res.send("login request");
});

app.get("*", (req, res, next) => {
  const err = new ExpressError(404, "This page does not exist");
  next(err);
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error", { message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
