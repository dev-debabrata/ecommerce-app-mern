import { Product } from "../models/product.model.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      bestseller,
      sizes,
    } = req.body;

    const images = [
      req.files?.image1?.[0],
      req.files?.image2?.[0],
      req.files?.image3?.[0],
      req.files?.image4?.[0],
    ].filter(Boolean);

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    const imageUrls = await Promise.all(
      images.map((file) => uploadToCloudinary(file.buffer)),
    );

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      bestseller: bestseller === "true",
      sizes: JSON.parse(sizes),
      image: imageUrls,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// export const createProduct = async (req, res) => {
//   try {
//     const product = await Product.create(req.body);

//     res.status(201).json({
//       message: "Product created successfully",
//       product,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Something went wrong",
//       error: error.message,
//     });
//   }
// };

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "No product found",
      });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      bestSeller,
      sizes,
    } = req.body;

    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: "No product found" });
    }

    // Start with existing images, replace slots that have new uploads
    const images = [...(existingProduct.images || [])];

    const fileSlots = [
      req.files?.image1?.[0],
      req.files?.image2?.[0],
      req.files?.image3?.[0],
      req.files?.image4?.[0],
    ];

    for (let i = 0; i < fileSlots.length; i++) {
      const file = fileSlots[i];
      if (file) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
        fs.unlinkSync(file.path);
        images[i] = result.secure_url; // replace that slot
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price: Number(price),
        category,
        subCategory,
        bestSeller: bestSeller === "true",
        sizes: JSON.parse(sizes || "[]"),
        images,
      },
      { returnDocument: "after" },
    );

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// export const updateProduct = async (req, res) => {
//   try {
//     const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });

//     if (!product) {
//       return res.status(404).json({
//         message: "No product found",
//       });
//     }

//     res.status(200).json({
//       message: "Product updated successfully",
//       product,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Something went wrong",
//       error: error.message,
//     });
//   }
// };

export const updateProductField = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { returnDocument: "after" },
    );

    if (!product) {
      return res.status(404).json({
        message: "No product found",
      });
    }

    res.status(200).json({
      message: "Field updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "No product found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
