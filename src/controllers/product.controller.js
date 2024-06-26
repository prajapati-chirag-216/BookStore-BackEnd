const ProductServices = require("../services/product.service");
const SORTING_OPTIONS = require("../utils/variables");

const ProductController = {
  async getProductsOfCategory(req, res) {
    const data = await ProductServices.getProductsOfCategory(req.params.id);
    res.status(200).send(data);
  },

  async getProductHandler(req, res) {
    const data = await ProductServices.getProductHandler(req.params.id);
    res.status(200).send(data);
  },

  async getAllProductsHandler(req, res) {
    const data = await ProductServices.getAllProductsHandler();
    res.status(200).send(data);
  },
  async searchProductHandler(req, res) {
    const data = await ProductServices.searchProductHandler(req.params.name);
    res.status(200).send(data);
  },
  async addProductHandler(req, res) {
    const data = await ProductServices.addProductHandler(req.body);
    res.status(200).send(data);
  },

  async deleteProductHandler(req, res) {
    const Productid = req.params.id;
    const data = await ProductServices.deleteProductHandler(Productid);
    res.status(200).send(data);
  },

  async updateProductHandler(req, res) {
    const productId = req.params.id;
    const productData = req.body;

    const data = await ProductServices.updateProductHandler(
      productData,
      productId
    );

    res.status(200).send(data);
  },

  async getFilteredProductsHandler(req, res) {
    const id = req.params.id;
    const windowSize = req.params?.window || 10;
    const skip = (req.params?.skip || 0) * windowSize;
    const sortBy =
      req.params?.sortBy || SORTING_OPTIONS.SORT_BY_DATE_NEW_TO_OLD;
    const searchTxt = req.params?.searchTxt || "all";

    const data = await ProductServices.getFilteredProductsHandler(
      id,
      windowSize,
      skip,
      sortBy,
      searchTxt
    );
    res.status(200).send(data);
  },
};

module.exports = ProductController;
