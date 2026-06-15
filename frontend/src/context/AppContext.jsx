import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { getProducts } from "../services/productService";

import {
  getUserData,
  addToWishlist as addWishlistApi,
  removeFromWishlist as removeWishlistApi,
  addToCart as addCartApi,
  removeFromCart as removeCartApi,
  updateCartQuantity as updateCartQuantityApi,
  clearCart as clearCartApi,
} from "../services/userService";

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null"),
  );

  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    setIsAuthReady(true);
  }, []);

  const {
    data: products = [],
    isLoading: productsLoading,
    refetch: fetchProducts,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    select: (data) => (Array.isArray(data) ? data : []),
    // staleTime: 1000 * 60 * 2,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const {
    data: userData,
    isLoading: userDataLoading,
    refetch: loadUserData,
  } = useQuery({
    queryKey: ["userData", user?._id || user?.email],
    queryFn: getUserData,
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setWishlistItems([]);
      return;
    }

    setCartItems(userData?.cartItems || []);
    setWishlistItems(userData?.wishlistItems || []);
  }, [user, userData]);

  const subTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const latestProduct = products.find(
        (product) => product._id === item._id || product._id === item.productId,
      );

      const price = Number(latestProduct?.price || item.price || 0);
      const quantity = Number(item.quantity) || 1;

      return acc + price * quantity;
    }, 0);
  }, [cartItems, products]);

  const togglePassword = () => {
    setIsPasswordHidden((prev) => !prev);
  };

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const addToWishlist = async (product) => {
    if (!user) {
      toast.warning("Please login first");
      return false;
    }

    try {
      const exists = wishlistItems.some((item) => item._id === product._id);

      if (exists) {
        const data = await removeWishlistApi(product._id);
        setWishlistItems(data.wishlistItems || []);
        toast.info("Removed from wishlist");
      } else {
        const data = await addWishlistApi(product._id);
        setWishlistItems(data.wishlistItems || []);
        toast.success("Added to wishlist");
      }

      return true;
    } catch (error) {
      console.log(error);
      toast.error("Wishlist update failed");
      return false;
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  const addToCart = async (product, size) => {
    if (!user) {
      toast.warning("Please login first");
      return false;
    }

    if (!size) {
      toast.warning("Please select a size");
      return false;
    }

    try {
      const data = await addCartApi(product._id, size);
      setCartItems(data.cartItems || []);
      toast.success("Added to cart");
      return true;
    } catch (error) {
      console.log(error);
      toast.error("Cart update failed");
      return false;
    }
  };

  const removeFromCart = async (productId, size) => {
    try {
      const data = await removeCartApi(productId, size);
      setCartItems(data.cartItems || []);
      toast.success("Product deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Cart delete failed");
    }
  };

  const updateCartQuantity = async (productId, size, quantity) => {
    try {
      const data = await updateCartQuantityApi(productId, size, quantity);
      setCartItems(data.cartItems || []);
    } catch (error) {
      console.log(error);
      toast.error("Quantity update failed");
    }
  };

  const clearCart = async () => {
    try {
      const data = await clearCartApi();
      setCartItems(data.cartItems || []);
      return true;
    } catch (error) {
      console.log(error);
      toast.error("Cart clear failed");
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        isAuthReady,

        isDropdownOpen,
        setIsDropdownOpen,
        isSearchBarOpen,
        setIsSearchBarOpen,

        user,
        setUser,
        loginUser,

        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,

        wishlistItems,
        setWishlistItems,
        addToWishlist,
        isInWishlist,

        loadUserData,

        products,
        fetchProducts,

        productsLoading,
        userDataLoading,
        loading: productsLoading || userDataLoading,

        subTotal,

        isUserDetailOpen,
        setIsUserDetailOpen,

        isPasswordHidden,
        setIsPasswordHidden,
        togglePassword,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context;
};