const express = require("express");
const router = new express.Router();
const catchAsyncErr = require("../utils/catchAsyncErr");
const Product = require("../models/product");
const { productAuthorize, isLoggedIn } = require("../middlewares/authorize");
const routeRemember = require("../middlewares/routeRemember");
const productValidation = require("../middlewares/productValidation");
const Multer = require("multer");
const storage = new Multer.memoryStorage();
const upload = Multer({ storage });
const { cloudinary, handleUpload } = require("../cloudinaryConfig");

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
  isLoggedIn,
  upload.single("image"),
  routeRemember,
  productValidation,
  catchAsyncErr(async (req, res, next) => {
    const { title, price } = req.body;
    const newProduct = new Product({ title, price });
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUpload(dataURI);
    newProduct.imageUrl = cldRes.url;
    newProduct.seller = req.session.currentUser;
    console.log(newProduct);
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
