const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: String },
    seller: { type: String },
    deliveryAdmin: { type: String },
    product: { type: String },
    quantity: { type: Number, required: true },
    accepting_status: { type: String, default: "pending" },
    delivery_status: { type: String, default: "pending" },
    current_owner: { type: String },
    track: [
      {
        recieve_status: { type: Boolean, default: false },
        give_status: { type: Boolean, default: false },
        owner: { type: String },
      },
    ],
    web3_id: { type: String },
    transfer_otp: {
      code: { type: String },
      generatedAt: { type: Date },
      forTrackIndex: { type: Number },
      isVerified: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
