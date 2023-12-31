const Product = require("../model/product.modal");

const ProductServices = {
  async getAllProductsHandler() {
    const data = await Product.find({ isDeleted: false })
      .populate({ path: "category", select: "name _id" })
      .sort({ createdAt: 1 })
      .select({ __v: 0 });
    return data;
  },

  async getProductsOfCategory(id) {
    const data = await Product.find({ category: id, isDeleted: false }).select({
      category: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    });

    return data;
  },

  async getProductHandler(id) {
    const data = await Product.findOne({ _id: id, isDeleted: false }).populate({
      path: "category",
      select: "name _id",
    });

    const reviews = await data.populate("productReviews");
    const avgRatings =
      reviews.productReviews.reduce((a, b) => a + b.rating, 0) /
      reviews.productReviews.length;
    return {
      ...data._doc,
      avgRatings,
      reviewedBy: reviews.productReviews.length,
    };
  },

  async getFilteredProductsHandler(id, name) {
    let data;
    if (name === "sortByHighPrice") {
      data = await Product.find({ category: id }).sort({ price: -1 });
    } else if (name === "sortByLowPrice") {
      data = await Product.find({ category: id }).sort({ price: 1 });
    } else if (name === "sortByNewDate") {
      data = await Product.find({ category: id }).sort({ createdAt: -1 });
    } else if (name === "sortByOldDate") {
      data = await Product.find({ category: id }).sort({ createdAt: 1 });
    } else if (name === "sortByPopularity") {
      const productsArr = await Product.find({ category: id });
      const result = await Promise.all(
        productsArr.map(async (prodObj) => {
          const reviews = await prodObj.populate("productReviews");

          const avgRatings =
            reviews.productReviews.reduce((a, b) => a + b.rating, 0) /
            reviews.productReviews.length;

          return {
            ...prodObj._doc,
            avgRatings: isNaN(avgRatings) ? 0 : avgRatings,
            reviewedBy: reviews.productReviews.length,
          };
        })
      );
      data = result.sort((a, b) => b.avgRatings - a.avgRatings);
    }

    if (!data) {
      throw { message: "Somthing went wrong!" };
    }
    return data;
  },

  async addProductHandler(product) {
    const data = await new Product({
      ...product,
      price: +product.price,
      quantity: +product.quantity,
    }).populate("category");

    if (!data) {
      throw { message: "Product was not added!" };
    }
    await data.save();
    return data;
  },

  async deleteProductHandler(productid) {
    const data = await Product.findOneAndUpdate(
      { _id: productid },
      { status: "Not-Avilable", isDeleted: true }
    );
    if (!data) {
      throw { message: "Product was not deleted!" };
    }
    return data;
  },

  async updateProductHandler(productData, productId) {
    const data = await Product.findByIdAndUpdate(
      { _id: productId },
      {
        ...productData,
      },
      { new: 1 }
    );
    if (!data) {
      throw { message: "Product was not updated!" };
    }
    return data;
  },

  async checkProductsQuantityHandler(productData) {
    await Promise.all(
      productData.map(async (product) => {
        const data = await Product.findById(product.productId);
        if (data && data.quantity < product.quantity) {
          throw {
            message: "one or more items does not have sufficient quantity.",
            status: 404,
          };
        }
      })
    );
    // const data = Product.find({ id: { $in: productIds } });
    return { success: true };
  },

  async updateProductsQuantityHandler(productData) {
    await Promise.all(
      productData.map(async (product) => {
        const updatedProduct = await Product.findByIdAndUpdate(
          product.productId,
          { $inc: { quantity: -product.quantity } },
          { new: true }
        );

        if (!updatedProduct || updatedProduct.quantity < 0) {
          throw {
            message: "one or more items does not have sufficient quantity.",
            status: 404,
          };
        }
      })
    );
    return { success: true };
  },
};

module.exports = ProductServices;
