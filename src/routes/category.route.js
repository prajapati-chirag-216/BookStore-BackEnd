const express = require("express");
const { adminAuth } = require("../middlewares/auth");
const permissions = require("../utils/permissions");
const catchAsync = require("../errors/catchAsync");

const CategoryController = require("../controllers/category.controller");
const router = express.Router();

function allowUnauthenticated(role) {
  return (req, res, next) => {
    const { origin } = req.headers;
    if (origin === "http://localhost:5000") {
      return next();
    } else {
      adminAuth(role)(req, res, next).catch((error) => {
        console.error("adminAuth error:", error);
        next(error);
      });
    }
  };
}

router.get(
  "/fetchCategory/:id",
  catchAsync(allowUnauthenticated(permissions.FETCH_CATEGORY)),
  catchAsync(CategoryController.getCategoryHandler)
);
router.get(
  "/searchCategory/:name",
  catchAsync(adminAuth(permissions.SEARCH_USERS)),
  catchAsync(CategoryController.searchCategoryHandler)
);
router.get(
  "/getAllCategories",
  catchAsync(allowUnauthenticated(permissions.FETCH_CATEGORIES)),
  catchAsync(CategoryController.getAllCategoriesHandler)
);
router.get(
  "/getCategoryByName/:name",
  catchAsync(allowUnauthenticated(permissions.FETCH_CATEGORY_BY_NAME)),
  catchAsync(CategoryController.getCategoryByName)
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
