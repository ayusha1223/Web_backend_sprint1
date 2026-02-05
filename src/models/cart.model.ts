import { Schema, model } from "mongoose";

const CartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        img: String,
        qty: Number,
        price: Number,
      },
    ],
  },
  { timestamps: true }
);

export default model("Cart", CartSchema);
