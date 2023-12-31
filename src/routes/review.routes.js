const express = require("express");
const { auth } = require("../middlewares/userAuth");
const { adminAuth } = require("../middlewares/auth");
const roleTypes = require("../utils/roleTypes");
const catchAsync = require("../errors/catchAsync");

const ReviewController = require("../controllers/review.controller");

function allowUnauthenticated(role) {
  return (req, res, next) => {
    const { origin } = req.headers;
    if (origin === "http://localhost:5000") {
      return next();
    } else {
      adminAuth(role)(req, res, next).catch((error) => {
        next(error);
      });
    }
  };
}

const router = express.Router();

router.get(
  "/getproductReviews/:id",
  catchAsync(allowUnauthenticated(roleTypes.FETCH_REVIEWS)),
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
  catchAsync(adminAuth(roleTypes)),
  catchAsync(ReviewController.deleteReviewHandler)
);

module.exports = router;
