import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  updateProductField,
  deleteProduct,
} from "../controllers/product.controller.js";

import upload from "../middleware/upload.js";
import { protectAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post(
  "/",
  protectAdmin,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  createProduct,
);

router.get("/", getProducts);
router.get("/:id", getProductById);

router.put(
  "/:id",
  protectAdmin,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  updateProduct,
);

router.patch("/:id", protectAdmin, updateProductField);
router.delete("/:id", protectAdmin, deleteProduct);

export default router;

// import express from "express";

// import {
//   createProduct,
//   getProducts,
//   getProductById,
//   updateProduct,
//   updateProductField,
//   deleteProduct,
// } from "../controllers/product.controller.js";
// import upload from "../middleware/upload.js";

// const router = express.Router();

// // router.post("/", createProduct);
// router.post(
//   "/",
//   upload.fields([
//     { name: "image1", maxCount: 1 },
//     { name: "image2", maxCount: 1 },
//     { name: "image3", maxCount: 1 },
//     { name: "image4", maxCount: 1 },
//   ]),
//   createProduct,
// );
// router.get("/", getProducts);
// router.get("/:id", getProductById);

// // router.put("/:id", updateProduct);
// router.patch("/:id", updateProductField);
// router.delete("/:id", deleteProduct);

// export default router;
