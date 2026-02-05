import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    items: [
      {
        img: String,
        qty: Number,
        price: Number,
      },
    ],
    totalAmount: Number,
    paymentMethod: String,
    paymentStatus: String,
    address: {
      name: String,
      phone: String,
      address: String,
      city: String,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

export default Order; // ✅ DEFAULT EXPORT
