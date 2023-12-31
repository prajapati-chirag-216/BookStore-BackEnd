const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const reviewRouter = require("./routes/review.routes");
const productRouter = require("./routes/product.route");
const adminRouter = require("./routes/admin.route");
const categoryRouter = require("./routes/category.route");
const userRouter = require("./routes/user.route");
const orderRouter = require("./routes/order.route");
const contactUsRouter = require("./routes/contactUs.route");
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(adminRouter);
app.use(userRouter);
app.use(reviewRouter);
app.use(productRouter);
app.use(categoryRouter);
app.use(orderRouter);
app.use(contactUsRouter);

app.use((err, req, res, next) => {
  let errorCode = 500;
  let errorMessage = "Internal Server Error!";
  res.status(err.status || errorCode).send({
    message: err.message || errorMessage,
  });
});

module.exports = app;
