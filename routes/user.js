const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const catchAsyncErr = require("../utils/catchAsyncErr");
const ExpressError = require("../utils/ExpressError");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/register",
  catchAsyncErr(async (req, res) => {
    const { username, email, password, userType } = req.body;
    const newUser = new User({ username, email, userType });
    const hashedPassword = await bcrypt.hash(password, 13);
    newUser.password = hashedPassword;
    newUser.chart = [];
    await newUser.save();
    res.redirect("/products");
  })
);

router.post(
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

router.post("/logout", (req, res) => {
  req.session.currentUser = null;
  res.redirect("/products");
});

module.exports = router;
