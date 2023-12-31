const express = require("express");
const { adminAuth } = require("../middlewares/auth");
const roleTypes = require("../utils/roleTypes");
const catchAsync = require("../errors/catchAsync");
const ProductController = require("../controllers/product.controller");

const router = express.Router();

router.get(
  "/getproductsOfCategory/:id",
  catchAsync(ProductController.getProductsOfCategory)
);
router.get("/getproduct/:id", catchAsync(ProductController.getProductHandler));
router.get(
  "/getAllproducts",
  catchAsync(adminAuth(roleTypes.FETCH_PRODUCTS)),
  catchAsync(ProductController.getAllProductsHandler)
);
router.get(
  "/getfilteredproducts/:id/:name",
  catchAsync(ProductController.getFilteredProductsHandler)
);

router.post(
  "/addproduct",
  catchAsync(adminAuth(roleTypes.ADD_PRODUCT)),
  catchAsync(ProductController.addProductHandler)
);

router.delete(
  "/deleteproduct/:id",
  catchAsync(adminAuth(roleTypes.DELETE_PRODUCT)),
  catchAsync(ProductController.deleteProductHandler)
);

router.patch(
  "/updateproduct/:id",
  catchAsync(adminAuth(roleTypes.UPDATE_PRODUCT)),
  catchAsync(ProductController.updateProductHandler)
);

module.exports = router;
