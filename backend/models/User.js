const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    city: { type: String, required: true },
    category: { type: String, required: true },
    admin: { type: Boolean, default: false },
    status: { type: Boolean, default: false },
    product_request_queue: [{ type: String }], // for delivery admin
    product_left_to_deliver: [
      {
        order: { type: String },
        recieve_status: { type: Boolean, default: false },
        give_status: { type: Boolean, default: false },
      },
    ], // for all others
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
