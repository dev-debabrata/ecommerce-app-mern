import User from "../models/user.model.js";

const getUserId = (req) => req.user?._id || req.user?.id;

const formatCartItems = (cartItems = []) => {
  return cartItems
    .filter((item) => item.productId)
    .map((item) => ({
      _id: item.productId._id,
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image,
      category: item.productId.category,
      subCategory: item.productId.subCategory,
      size: item.size,
      quantity: item.quantity,
    }));
};

const formatWishlistItems = (wishlistItems = []) => {
  return wishlistItems
    .filter((item) => item.productId)
    .map((item) => ({
      _id: item.productId._id,
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image,
      category: item.productId.category,
      subCategory: item.productId.subCategory,
    }));
};

export const getUserData = async (req, res) => {
  try {
    const userId = getUserId(req);

    const user = await User.findById(userId)
      .populate("cartItems.productId")
      .populate("wishlistItems.productId")
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      cartItems: formatCartItems(user.cartItems),
      wishlistItems: formatWishlistItems(user.wishlistItems),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const exists = user.wishlistItems.some(
      (item) => item.productId.toString() === productId,
    );

    if (!exists) {
      user.wishlistItems.push({ productId });
      await user.save();
    }

    await user.populate("wishlistItems.productId");

    res.status(200).json({
      success: true,
      message: exists ? "Already in wishlist" : "Added to wishlist",
      wishlistItems: formatWishlistItems(user.wishlistItems),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.wishlistItems = user.wishlistItems.filter(
      (item) => item.productId.toString() !== productId,
    );

    await user.save();
    await user.populate("wishlistItems.productId");

    res.status(200).json({
      success: true,
      message: "Removed from wishlist",
      wishlistItems: formatWishlistItems(user.wishlistItems),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { productId, size } = req.body;

    if (!productId || !size) {
      return res.status(400).json({
        success: false,
        message: "Product ID and size are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const existingItem = user.cartItems.find(
      (item) => item.productId.toString() === productId && item.size === size,
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push({
        productId,
        size,
        quantity: 1,
      });
    }

    await user.save();
    await user.populate("cartItems.productId");

    res.status(200).json({
      success: true,
      message: "Added to cart",
      cartItems: formatCartItems(user.cartItems),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { productId, size } = req.body;

    if (!productId || !size) {
      return res.status(400).json({
        success: false,
        message: "Product ID and size are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.cartItems = user.cartItems.filter(
      (item) =>
        !(item.productId.toString() === productId && item.size === size),
    );

    await user.save();
    await user.populate("cartItems.productId");

    res.status(200).json({
      success: true,
      message: "Removed from cart",
      cartItems: formatCartItems(user.cartItems),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCartQuantity = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { productId, size, quantity } = req.body;

    if (!productId || !size || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Product ID, size and quantity are required",
      });
    }

    const newQuantity = Number(quantity);

    if (newQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const item = user.cartItems.find(
      (item) => item.productId.toString() === productId && item.size === size,
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    item.quantity = newQuantity;

    await user.save();
    await user.populate("cartItems.productId");

    res.status(200).json({
      success: true,
      message: "Cart updated",
      cartItems: formatCartItems(user.cartItems),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.cartItems = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      cartItems: [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
