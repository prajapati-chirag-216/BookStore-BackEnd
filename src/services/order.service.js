const Order = require("../model/order.modal");
const User = require("../model/user.modal");

const OrderServices = {
  async postOrderHandler(orderData, userId) {
    const data = new Order(orderData);
    if (!data) {
      throw { message: "Order canceled" };
    }
    await data.save();
    await User.findByIdAndUpdate(
      { _id: userId },
      { cartItems: [] },
      { new: true }
    );
    return data;
  },

  async getOrderHandler(id) {
    const data = await Order.findById(id).populate("orderedItems.productId");
    if (!data) {
      throw { message: "Order not found" };
    }
    return data;
  },

  async getAllOrdersHandler() {
    const data = await Order.find().populate("orderedItems.productId");
    if (!data) {
      throw { message: "Orders not found" };
    }
    return data;
  },

  async updateOrderStatusHandler(status, OrderId) {
    const data = await Order.findByIdAndUpdate({ _id: OrderId }, status, {
      new: true,
    });
    if (!data) {
      throw { message: "Your order status was not updated" };
    }

    return data;
  },

  async deleteOrderHandler(orderId) {
    const data = await Order.findByIdAndDelete({ _id: orderId });
    if (!data) {
      throw { message: "Your Order was Deleted" };
    }
    return data;
  },

  async getTodaysOrdersHandler() {
    const currentDate = new Date();
    const startOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );
    const endOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1
    );

    const data = await Order.find({
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    }).populate("orderedItems.productId");

    return data;
  },

  async getUserOrdersHandler(id) {
    const data = await Order.find({ userId: id }).populate(
      "orderedItems.productId"
    );

    return data;
  },
};

module.exports = OrderServices;
