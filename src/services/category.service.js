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

  async getCategoryByNameHandler(name) {
    const data = await Category.findOne(name).select({
      _id: 1,
    });

    return data._id.toString();
  },
};

module.exports = CategoryServices;
