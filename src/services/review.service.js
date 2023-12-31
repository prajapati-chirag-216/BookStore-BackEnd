const Review = require("../model/review.modal");

const ReviewServices = {
  async addReviewHandler(reviewData) {
    const data = new Review(reviewData);
    if (!data || data?.length == 0) {
      throw { message: "Review Was Not Posted!" };
    }
    await data.save();
    return data;
  },

  async getReviewHandler(userId, productId) {
    const data = await Review.findOne({
      userId: userId,
      productId: productId,
    }).select({
      __v: 0,
      productId: 0,
    });
    return data;
  },

  async getAllReviewsHandler(id) {
    const data = await Review.find({ productId: id }).select({
      __v: 0,
      productId: 0,
    });
    return data;
  },

  async deleteReviewHandler(id) {
    const data = await Review.findByIdAndDelete({ _id: id });
    if (!data) {
      throw { message: "Review Was Not  Deleted By Error!" };
    }
    return data;
  },

  async deleteUsersAllReviewHandler(id) {
    const data = await Review.findOneAndDelete({ userId: id });
    return data;
  },
};

module.exports = ReviewServices;
