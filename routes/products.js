const express = require("express");
const router = new express.Router();
const catchAsyncErr = require("../utils/catchAsyncErr");
const Product = require("../models/product");
const {
  productAuthorize,
  checkNewProduct,
} = require("../middlewares/authorize");
const routeRemember = require("../middlewares/routeRemember");
const productValidation = require("../middlewares/productValidation");

router.get(
  "/",
  catchAsyncErr(async (req, res, next) => {
    const products = await Product.find({});
    for (let product of products) {
      await product.populate("seller");
    }
    res.render("products/index", { products });
  })
);

router.get("/new", (req, res) => {
  res.render("products/new");
});

router.post(
  "/",
  checkNewProduct,
  routeRemember,
  productValidation,
  catchAsyncErr(async (req, res, next) => {
    const newProduct = new Product(req.body);
    newProduct.seller = req.session.currentUser;
    await newProduct.save();
    res.redirect("/products");
  })
);

router.get(
  "/:id",
  catchAsyncErr(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate("seller");
    if (!product) {
      throw new ExpressError(400, "Product could not found");
    }
    res.render("products/show", { product });
  })
);

router.get(
  "/:id/edit",
  productAuthorize,
  catchAsyncErr(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      throw new ExpressError(400, "Product could not found");
    }
    res.render("products/edit", { product });
  })
);

router.put(
  "/:id",
  productAuthorize,
  catchAsyncErr(async (req, res, next) => {
    const { id } = req.params;
    await Product.findByIdAndUpdate(id, req.body);
    res.redirect(`/products/${id}`);
  })
);

router.delete(
  "/:id",
  productAuthorize,
  catchAsyncErr(async (req, res, next) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect("/products");
  })
);

module.exports = router;
