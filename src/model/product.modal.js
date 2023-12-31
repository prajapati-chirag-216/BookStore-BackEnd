const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    bookName: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    status: {
      type: String,
      require: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "category",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

ProductSchema.virtual("productReviews", {
  ref: "review",
  localField: "_id",
  foreignField: "productId",
});

const Product = mongoose.model("product", ProductSchema);
module.exports = Product;
