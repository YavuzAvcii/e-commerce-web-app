const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const catchAsyncErr = require("./utils/catchAsyncErr");
const Review = require("./models/review");
const User = require("./models/user");
const ExpressError = require("./utils/ExpressError");
const productsRouter = require("./routes/products");
const bcrypt = require("bcrypt");
const session = require("express-session");

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

// review routes
app.post("/products/:productsId/reviews", (req, res) => {
  res.send("create new review");
});

app.delete("products/:productsId/reviews/:reviewId", (req, res) => {
  res.send("delete review");
});

// user routes

app.get("/register", (req, res) => {
  res.render("users/register");
});

app.get("/login", (req, res) => {
  res.render("users/login");
});

app.post(
  "/register",
  catchAsyncErr(async (req, res) => {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const hashedPassword = await bcrypt.hash(password, 13);
    newUser.password = hashedPassword;
    await newUser.save();
    res.redirect("/products");
  })
);

app.post(
  "/login",
  catchAsyncErr(async (req, res, next) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      next(new ExpressError(400, "invalid username or password"));
    }
    req.session.currentUser = user;
    res.redirect("/products");
  })
);

app.get("/secretroute", (req, res) => {
  if (req.session.currentUser) {
    res.send("WOW YOU HAVE SEEN THIS");
  }
  res.send("secret");
});

app.post("/logout", (req, res) => {
  req.session.currentUser = null;
  res.redirect("/products");
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
