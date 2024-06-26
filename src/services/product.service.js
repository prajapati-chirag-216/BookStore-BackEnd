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
    const data = await Product.find({ category: id, isDeleted: false })
      .select({
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      })
      .populate({
        path: "category",
        select: "name",
      });
    return data;
  },

  async searchProductHandler(id, searchName) {
    const searchNameWithoutSpaces = searchName.replace(/\s/g, "");
    const data = await Product.find({
      category: id,
      bookName: new RegExp(searchNameWithoutSpaces.split("").join(".*"), "i"),
      isDeleted: false,
    }).populate({
      path: "category",
      select: "name",
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

  // sorting products with applied search and filter
  async sortProductWithSearchHandler(
    id,
    windowSize,
    skipRecords,
    searchTxt,
    sortBy
  ) {
    if (searchTxt !== "all") {
      const searchResults = await this.searchProductHandler(id, searchTxt);
      const data = await Product.find({
        _id: { $in: searchResults.map((product) => product._id) },
      })
        .sort(sortBy)
        .skip(skipRecords)
        .limit(windowSize + 1);
      return data;
    }
    const data = await Product.find({ category: id, isDeleted: false })
      .sort(sortBy)
      .skip(skipRecords)
      .limit(windowSize + 1);
    return data;
  },

  async getFilteredProductsHandler(
    id,
    windowSize,
    skipRecords,
    sortBy,
    searchTxt
  ) {
    let data;
    if (sortBy === "sortByHighPrice") {
      data = await this.sortProductWithSearchHandler(
        id,
        windowSize,
        skipRecords,
        searchTxt,
        { price: -1 }
      );
    } else if (sortBy === "sortByLowPrice") {
      data = await this.sortProductWithSearchHandler(
        id,
        windowSize,
        skipRecords,
        searchTxt,
        { price: 1 }
      );
    } else if (sortBy === "sortByNewDate") {
      data = await this.sortProductWithSearchHandler(
        id,
        windowSize,
        skipRecords,
        searchTxt,
        { createdAt: -1 }
      );
    } else if (sortBy === "sortByOldDate") {
      data = await this.sortProductWithSearchHandler(
        id,
        windowSize,
        skipRecords,
        searchTxt,
        { createdAt: 1 }
      );
    } else if (sortBy === "sortByPopularity") {
      data = await this.sortProductWithSearchHandler(
        id,
        windowSize,
        skipRecords,
        searchTxt,
        { createdAt: 1 }
      );

      const result = await Promise.all(
        data.map(async (prodObj) => {
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

    if (data.length > windowSize) {
      return { products: data.slice(0, windowSize), haveMore: true };
    }
    return { products: data, haveMore: false };
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
