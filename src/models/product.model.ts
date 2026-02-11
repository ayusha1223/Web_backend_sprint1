import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      enum: ["casual", "party", "wedding", "winter"],
      required: true,
    },

    sizes: [
      {
        type: String, // S, M, L, XL
      },
    ],

    stock: {
      type: Number,
      default: 0,
    },

    images: [
      {
        type: String,
      },
    ],

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
