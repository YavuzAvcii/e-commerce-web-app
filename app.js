if (process.env.NODE_ENV !== "prouction") {
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const productsRouter = require("./routes/products");
const session = require("express-session");
const userRouter = require("./routes/user");
const reviewsRouter = require("./routes/reviews");
const User = require("./models/user");
const Product = require("./models/product");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/e-commerce-web-app");
}

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const sessionConfig = {
  name: "eSession",
  secret: process.env.SESSION_SECRET || "thisisnotagoodsecret",
  saveUninitialized: true,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(express.static("public"));
app.use(session(sessionConfig));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use((req, res, next) => {
  res.locals.currentUser = req.session.currentUser;
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

// product routes
app.use("/products", productsRouter);

// user routes
app.use("/", userRouter);

// review routes
app.use("/products", reviewsRouter);

// cart routes
app.get("/cart", async (req, res) => {
  const user = await User.findById(req.session.currentUser._id).populate(
    "cart"
  );
  const cart = user.cart;
  console.log(cart);
  res.render("users/cart", { cart });
});

app.post("/cart/:productId", async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.session.currentUser._id);
  const product = await Product.findById(productId);
  user.cart.push(product._id);
  user.save();
  res.redirect(`/products/${productId}`);
});

// Remove product from cart
app.delete("/cart/:productId", async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.session.currentUser._id);
  user.cart = user.cart.filter((p) => p.valueOf() !== productId);
  user.save();
  res.redirect(`/cart`);
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
