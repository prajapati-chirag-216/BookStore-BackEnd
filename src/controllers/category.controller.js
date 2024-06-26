const CategoryServices = require("../services/category.service");

const CategoryController = {
  async addCategoryHandler(req, res) {
    await CategoryServices.addCategoryHandler(req.body);
    res.status(200).send({ success: true });
  },

  async getAllCategoriesHandler(req, res) {
    const data = await CategoryServices.getAllCategoriesHandler();
    res.status(200).send(data);
  },

  async getCategoryHandler(req, res) {
    const data = await CategoryServices.getCategoryHandler(req.params.id);
    res.status(200).send(data);
  },
  async searchCategoryHandler(req, res) {
    const data = await CategoryServices.searchCategoryHandler(req.params.name);
    res.status(200).send(data);
  },

  async updateCategoryHandler(req, res) {
    const data = await CategoryServices.updateCategoryHandler(
      req.body,
      req.params.id
    );

    return res.status(200).send(data);
  },

  async deleteCategoryHandler(req, res) {
    await CategoryServices.deleteCategoryHandler(req.params.id);
    res.status(200).send({ success: true });
  },

  async getFilteredCategoriesHandler(req, res) {
    const windowSize = req.params?.window || 10;
    const skip = (req.params?.skip || 0) * windowSize;
    const searchTxt = req.params?.searchTxt || "all";

    const data = await CategoryServices.getFilteredCategoriesHandler(
      windowSize,
      skip,
      searchTxt
    );
    res.status(200).send(data);
  },
};

module.exports = CategoryController;
