const express = require("express");
const { auth } = require("../middlewares/userAuth");
const { adminAuth } = require("../middlewares/auth");
const permissions = require("../utils/permissions");
const catchAsync = require("../errors/catchAsync");
const allowUnauthenticated = require("../middlewares/genreal");
const ReviewController = require("../controllers/review.controller");

const router = express.Router();

router.get(
  "/getproductReviews/:id",
  catchAsync(allowUnauthenticated(permissions.FETCH_REVIEWS)),
  catchAsync(ReviewController.getAllReviewsHandler)
);
router.get(
  "/getReview/:id",
  catchAsync(auth),
  catchAsync(ReviewController.getReviewHandler)
);

router.post(
  "/addproductReview/:id",
  catchAsync(auth),
  catchAsync(ReviewController.addReviewHandler)
);

router.delete(
  "/deleteReview/:id",
  catchAsync(adminAuth(permissions)),
  catchAsync(ReviewController.deleteReviewHandler)
);

module.exports = router;
