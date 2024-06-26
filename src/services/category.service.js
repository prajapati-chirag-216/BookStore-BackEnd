const Category = require("../model/category.modal");

const CategoryServices = {
  async addCategoryHandler(categoryData) {
    const data = new Category(categoryData);
    await data.save();
  },

  async getAllCategoriesHandler() {
    const data = await Category.aggregate([
      {
        $lookup: {
          from: "products", // name of the Product collection
          localField: "_id",
          foreignField: "category",
          as: "products",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          image: 1,
          createdAt: 1,
          updatedAt: 1,
          productCount: { $size: "$products" }, // get the count of products
        },
      },
    ]).exec();
    return data;
  },

  async getCategoryHandler(id) {
    const data = await Category.findById(id).select({ name: 1 });
    return data;
  },

  async searchCategoryHandler(searchName) {
    const searchNameWithoutSpaces = searchName.replace(/\s/g, "");
    const data = await Category.find({
      name: new RegExp(searchNameWithoutSpaces.split("").join(".*"), "i"),
    }).exec();

    return data;
  },

  async getFilteredCategoriesHandler(windowSize, skipRecords, searchName) {
    let data = [];
    if (searchName == "all") {
      data = await Category.find()
        .skip(skipRecords)
        .limit(windowSize + 1);
    } else {
      const searchNameWithoutSpaces = searchName.replace(/\s/g, "");
      data = await Category.find({
        name: new RegExp(searchNameWithoutSpaces.split("").join(".*"), "i"),
      })
        .skip(skipRecords)
        .limit(windowSize + 1);
    }

    if (data.length > windowSize) {
      return { categories: data.slice(0, windowSize), haveMore: true };
    }
    return { categories: data, haveMore: false };
  },

  async updateCategoryHandler(categoryData, id) {
    const data = await Category.findByIdAndUpdate(
      { _id: id },
      { ...categoryData },
      { new: 1 }
    );
    return data;
  },

  async deleteCategoryHandler(id) {
    const data = await Category.findByIdAndDelete(id);
    if (!data || data.length == 0) {
      throw { message: "Item not Exist!" };
    }
    data.removeProducts();
  },
};

module.exports = CategoryServices;
