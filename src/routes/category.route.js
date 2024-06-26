const express = require("express");
const { adminAuth } = require("../middlewares/auth");
const permissions = require("../utils/permissions");
const catchAsync = require("../errors/catchAsync");
const allowUnauthenticated = require("../middlewares/genreal");

const CategoryController = require("../controllers/category.controller");
const router = express.Router();

router.get(
  "/fetchCategory/:id",
  catchAsync(allowUnauthenticated(permissions.FETCH_CATEGORY)),
  catchAsync(CategoryController.getCategoryHandler)
);
// this api is used for admins when they serach categories
router.get(
  "/searchCategory/:name",
  catchAsync(adminAuth(permissions.SEARCH_USERS)),
  catchAsync(CategoryController.searchCategoryHandler)
);
// this api is used for users to show categories with serach
router.get(
  "/getfilteredcategories/:window/:skip/:searchTxt",
  catchAsync(allowUnauthenticated(permissions.FETCH_CATEGORIES)),
  catchAsync(CategoryController.getFilteredCategoriesHandler)
);
router.get(
  "/getAllCategories",
  catchAsync(allowUnauthenticated(permissions.FETCH_CATEGORIES)),
  catchAsync(CategoryController.getAllCategoriesHandler)
);

router.post(
  "/addCategory",
  catchAsync(adminAuth(permissions.ADD_CATEGORY)),
  catchAsync(CategoryController.addCategoryHandler)
);
router.delete(
  "/deleteCategory/:id",
  catchAsync(adminAuth(permissions.DELETE_CATEGORY)),
  catchAsync(CategoryController.deleteCategoryHandler)
);
router.patch(
  "/updatecategory/:id",
  catchAsync(adminAuth(permissions.UPDATE_CATEGORY_BY_ID)),
  catchAsync(CategoryController.updateCategoryHandler)
);

module.exports = router;
