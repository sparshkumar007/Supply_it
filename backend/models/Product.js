const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    seller: { type: String },
    deliveryAdmin: { type: String },
    status: { type: String, default: "available" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
