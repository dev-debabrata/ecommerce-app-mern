import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: [String],
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    subCategory: {
      type: String,
      required: true,
    },

    sizes: {
      type: [String],
      required: true,
    },

    bestseller: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Product = mongoose.model("Product", productSchema);

// import mongoose from "mongoose";

// const ProductSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//     images: {
//       type: Array,
//       required: true,
//     },
//     category: {
//       type: String,
//       required: true,
//     },
//     subCategory: {
//       type: String,
//       required: true,
//     },
//     sizes: {
//       type: Array,
//       required: true,
//     },
//     bestSeller: {
//       type: Boolean,
//     },
//   },
//   { timestamps: true },
// );
// export const Product = mongoose.model("Product", ProductSchema);
