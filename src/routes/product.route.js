const express = require("express");
const { adminAuth } = require("../middlewares/auth");
const permissions = require("../utils/permissions");
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
  catchAsync(adminAuth(permissions.FETCH_PRODUCTS)),
  catchAsync(ProductController.getAllProductsHandler)
);
router.get(
  "/searchProduct/:name",
  catchAsync(adminAuth(permissions.SEARCH_PRODUCTS)),
  catchAsync(ProductController.searchProductHandler)
);
router.get(
  "/getfilteredproducts/:id/:name",
  catchAsync(ProductController.getFilteredProductsHandler)
);

router.post(
  "/addproduct",
  catchAsync(adminAuth(permissions.ADD_PRODUCT)),
  catchAsync(ProductController.addProductHandler)
);

router.delete(
  "/deleteproduct/:id",
  catchAsync(adminAuth(permissions.DELETE_PRODUCT)),
  catchAsync(ProductController.deleteProductHandler)
);

router.patch(
  "/updateproduct/:id",
  catchAsync(adminAuth(permissions.UPDATE_PRODUCT)),
  catchAsync(ProductController.updateProductHandler)
);

module.exports = router;
