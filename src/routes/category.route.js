const express = require("express");
const { adminAuth } = require("../middlewares/auth");
const roleTypes = require("../utils/roleTypes");
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
  catchAsync(allowUnauthenticated(roleTypes.FETCH_CATEGORY)),
  catchAsync(CategoryController.getCategoryHandler)
);
router.get(
  "/getAllCategories",
  catchAsync(allowUnauthenticated(roleTypes.FETCH_CATEGORIES)),
  catchAsync(CategoryController.getAllCategoriesHandler)
);
router.get(
  "/getCategoryByName/:name",
  catchAsync(allowUnauthenticated(roleTypes.FETCH_CATEGORY_BY_NAME)),
  catchAsync(CategoryController.getCategoryByName)
);
router.post(
  "/addCategory",
  catchAsync(adminAuth(roleTypes.ADD_CATEGORY)),
  catchAsync(CategoryController.addCategoryHandler)
);
router.delete(
  "/deleteCategory/:id",
  catchAsync(adminAuth(roleTypes.DELETE_CATEGORY)),
  catchAsync(CategoryController.deleteCategoryHandler)
);
router.patch(
  "/updatecategory/:id",
  catchAsync(adminAuth(roleTypes.UPDATE_CATEGORY_BY_ID)),
  catchAsync(CategoryController.updateCategoryHandler)
);

module.exports = router;
