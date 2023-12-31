const OrderServices = require("../services/order.service");
const ProductServices = require("../services/product.service");

const OrderController = {
  async postOrderHandler(req, res) {
    const orderData = req.body;
    orderData.userId = req.user._id;
    orderData.contactInformation.email = req.user.email;
    orderedItems = orderData.orderedItems;

    const result = await ProductServices.checkProductsQuantityHandler(
      orderedItems
    );
    if (result?.success) {
      const response = await OrderServices.postOrderHandler(
        orderData,
        req.user._id
      );
      if (response) {
        await ProductServices.updateProductsQuantityHandler(orderedItems);
      }
    }
    res.status(200).send({ success: true });
  },

  async getOrderHandler(req, res) {
    const data = await OrderServices.getOrderHandler(req.params.id);

    res.status(200).send(data);
  },
  async getAllOrdersHandler(req, res) {
    const data = await OrderServices.getAllOrdersHandler();

    res.status(200).send(data);
  },
  async getOrderStatusHandler(req, res) {
    const status = req.body;
    const OrderId = req.params.id;
    const data = await OrderServices.updateOrderStatusHandler(status, OrderId);

    res.status(200).send(data);
  },
  async getOrderByIdHandler(req, res) {
    const orderId = req.params.id;
    const data = await OrderServices.getOrderHandler(orderId);

    res.status(200).send(data);
  },
  async deleteOrderHandler(req, res) {
    const id = req.params.id;
    const data = await OrderServices.deleteOrderHandler(id);

    res.status(200).send(data);
  },
  async getTodaysOrdersHandler(req, res) {
    const data = await OrderServices.getTodaysOrdersHandler();

    res.status(200).send(data);
  },
  async getUserOrdersHandler(req, res) {
    const userId = req.user._id;
    const data = await OrderServices.getUserOrdersHandler(userId);
    res.status(200).send(data);
  },
};

module.exports = OrderController;
