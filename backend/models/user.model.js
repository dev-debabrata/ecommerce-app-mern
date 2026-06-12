import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    resetToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;

// import mongoose, { Schema } from "mongoose";

// const UserSChema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,

//     },
//     email: {
//       type: String,
//       required: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     resetToken: {
//       type: String,
//       default: null,
//     },
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", UserSChema);

// export default User;
