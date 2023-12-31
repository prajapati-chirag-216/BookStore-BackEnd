const express = require("express");
const { adminAuth } = require("../middlewares/auth");
const { auth } = require("../middlewares/userAuth");
const roleTypes = require("../utils/roleTypes");
const catchAsync = require("../errors/catchAsync");

const OrderController = require("../controllers/order.controller");

function verifyAuth(role) {
  return (req, res, next) => {
    const { origin } = req.headers;
    if (origin === "http://localhost:5000") {
      auth(req, res, next).catch((error) => {
        console.error("auth error:", error);
        next(error);
      });
    } else {
      adminAuth(role)(req, res, next).catch((error) => {
        console.error("adminAuth error:", error);
        next(error);
      });
    }
  };
}
const router = express.Router();

router.get(
  "/getAllOrders",
  catchAsync(adminAuth(roleTypes.FETCH_ORDERS)),
  catchAsync(OrderController.getAllOrdersHandler)
);
router.get(
  "/getUserOrders",
  catchAsync(auth),
  OrderController.getUserOrdersHandler
);
router.get(
  "/getOrder/:id",
  catchAsync(verifyAuth(roleTypes.FETCH_ORDER_BY_ID)),
  catchAsync(OrderController.getOrderByIdHandler)
);
router.get(
  "/getTodaysOrders",
  catchAsync(adminAuth(roleTypes.FETCH_TODAYS_ORDERS)),
  catchAsync(OrderController.getTodaysOrdersHandler)
);

router.post(
  "/postOrder",
  catchAsync(auth),
  catchAsync(OrderController.postOrderHandler)
);

router.patch(
  "/updateOrderStatus/:id",
  catchAsync(adminAuth(roleTypes.UPDATE_ORDER_STATUS)),
  catchAsync(OrderController.getOrderStatusHandler)
);

router.delete(
  "/deleteOrder/:id",
  catchAsync(adminAuth(roleTypes.DELETE_ORDER)),
  catchAsync(OrderController.deleteOrderHandler)
);

module.exports = router;
