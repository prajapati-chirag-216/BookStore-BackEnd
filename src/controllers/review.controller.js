const ReviewServices = require("../services/review.service");

const ReviewController = {
  async addReviewHandler(req, res) {
    const reviewData = {
      productId: req.params.id,
      userId: req.user._id,
      name: req.user.name,
      ...req.body,
    };
    const data = await ReviewServices.addReviewHandler(reviewData);
    res.status(200).send(data);
  },

  async getReviewHandler(req, res) {
    const userId = req?.user?._id;
    const productId = req.params.id;
    const data = await ReviewServices.getReviewHandler(userId, productId);
    res.status(200).send(data);
  },

  async getAllReviewsHandler(req, res) {
    const productId = req.params.id;
    const data = await ReviewServices.getAllReviewsHandler(productId);

    res.status(200).send(data);
  },

  async deleteReviewHandler(req, res) {
    const id = req.params.id;
    const data = await ReviewServices.deleteReviewHandler(id);
    res.status(200).send(data);
  },
};

module.exports = ReviewController;
