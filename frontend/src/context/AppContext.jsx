import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { axiosInstance } from "../utils/axios";
import { toast } from "react-toastify";

const AppContext = createContext(undefined);

const getUserKey = (userId, key) => `${key}_${userId}`;
const getUserId = (user) => user?._id || user?.id || null;

export const AppProvider = ({ children }) => {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null"),
  );

  const [cartItems, setCartItems] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const userId = getUserId(storedUser);
    if (!userId) return [];
    return JSON.parse(
      localStorage.getItem(getUserKey(userId, "cartItems")) || "[]",
    );
  });

  const [wishlistItems, setWishlistItems] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const userId = getUserId(storedUser);
    if (!userId) return [];
    return JSON.parse(
      localStorage.getItem(getUserKey(userId, "wishlistItems")) || "[]",
    );
  });

  useEffect(() => {
    setIsAuthReady(true);
  }, []);

  // Sync cart to localStorage under user's key
  useEffect(() => {
    const userId = getUserId(user);
    if (userId) {
      localStorage.setItem(
        getUserKey(userId, "cartItems"),
        JSON.stringify(cartItems),
      );
    }
  }, [cartItems, user]);

  // Sync wishlist to localStorage under user's key
  useEffect(() => {
    const userId = getUserId(user);
    if (userId) {
      localStorage.setItem(
        getUserKey(userId, "wishlistItems"),
        JSON.stringify(wishlistItems),
      );
    }
  }, [wishlistItems, user]);

  const fetchProducts = async (showLoader = true) => {
    if (showLoader) setLoading(true);

    try {
      const res = await axiosInstance.get("/products");
      const productList = res.data.products || res.data.data || res.data;
      setProducts(Array.isArray(productList) ? productList : []);
    } catch (err) {
      console.error(err);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(true);

    const interval = setInterval(() => {
      fetchProducts(false);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const subTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const latestProduct = products.find(
        (product) => product._id === item._id,
      );
      const price = Number(latestProduct?.price || item.price || 0);
      const quantity = Number(item.quantity) || 1;
      return acc + price * quantity;
    }, 0);
  }, [cartItems, products]);

  const togglePassword = () => {
    setIsPasswordHidden((prev) => !prev);
  };

  // Called after successful login — restores that user's saved cart & wishlist
  const loginUser = (userData) => {
    const userId = getUserId(userData);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    const savedCart = JSON.parse(
      localStorage.getItem(getUserKey(userId, "cartItems")) || "[]",
    );
    const savedWishlist = JSON.parse(
      localStorage.getItem(getUserKey(userId, "wishlistItems")) || "[]",
    );

    setCartItems(savedCart);
    setWishlistItems(savedWishlist);
  };

  const addToWishlist = (product) => {
    if (!user) {
      toast.warning("Please login first");
      return false;
    }

    const exists = wishlistItems.some((item) => item._id === product._id);

    if (exists) {
      setWishlistItems((prev) =>
        prev.filter((item) => item._id !== product._id),
      );
      toast.info("Removed from wishlist");
    } else {
      setWishlistItems((prev) => [...prev, product]);
      toast.success("Added to wishlist");
    }

    return true;
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId);
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

        wishlistItems,
        setWishlistItems,
        addToWishlist,
        isInWishlist,

        products,
        setProducts,
        fetchProducts,

        subTotal,

        isUserDetailOpen,
        setIsUserDetailOpen,

        isPasswordHidden,
        setIsPasswordHidden,
        togglePassword,

        loading,
        setLoading,
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


// import { createContext, useContext, useEffect, useMemo, useState } from "react";
// import { axiosInstance } from "../utils/axios";
// import { toast } from "react-toastify";

// const AppContext = createContext(undefined);

// export const AppProvider = ({ children }) => {
//   const [isAuthReady, setIsAuthReady] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
//   const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
//   const [isPasswordHidden, setIsPasswordHidden] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [products, setProducts] = useState([]);


//   const [user, setUser] = useState(() =>
//     JSON.parse(localStorage.getItem("user") || "null"),
//   );
//   const [cartItems, setCartItems] = useState(() =>
//     JSON.parse(localStorage.getItem("cartItems") || "[]"),
//   );
//   const [wishlistItems, setWishlistItems] = useState(() =>
//     JSON.parse(localStorage.getItem("wishlistItems") || "[]"),
//   );

//   useEffect(() => {
//     setIsAuthReady(true);
//   }, []);


//   const fetchProducts = async (showLoader = true) => {
//     if (showLoader) setLoading(true);

//     try {
//       const res = await axiosInstance.get("/products");

//       const productList = res.data.products || res.data.data || res.data;

//       setProducts(Array.isArray(productList) ? productList : []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       if (showLoader) setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts(true);

//     const interval = setInterval(() => {
//       fetchProducts(false);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);
//   // useEffect(() => {
//   //   const fetchedProducts = async () => {
//   //     setLoading(true);

//   //     try {
//   //       const res = await axiosInstance.get("/products");

//   //       const productList = res.data.products || res.data.data || res.data;

//   //       setProducts(Array.isArray(productList) ? productList : []);
//   //     } catch (err) {
//   //       console.error(err);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchedProducts();
//   // }, []);

//   const subTotal = useMemo(() => {
//     return cartItems.reduce((acc, item) => {
//       const latestProduct = products.find(
//         (product) => product._id === item._id,
//       );

//       const price = Number(latestProduct?.price || item.price || 0);
//       const quantity = Number(item.quantity) || 1;

//       return acc + price * quantity;
//     }, 0);
//   }, [cartItems, products]);

//   useEffect(() => {
//     localStorage.setItem("cartItems", JSON.stringify(cartItems));
//   }, [cartItems]);

//   useEffect(() => {
//     localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
//   }, [wishlistItems]);

//   const togglePassword = () => {
//     setIsPasswordHidden((prev) => !prev);
//   };


//   const addToWishlist = (product) => {
//     if (!user) {
//       toast.warning("Please login first");
//       return false;
//     }

//     const exists = wishlistItems.some(
//       (item) => item._id === product._id
//     );

//     if (exists) {
//       setWishlistItems((prev) =>
//         prev.filter((item) => item._id !== product._id)
//       );

//       toast.info("Removed from wishlist");
//     } else {
//       setWishlistItems((prev) => [...prev, product]);

//       toast.success("Added to wishlist");
//     }

//     return true;
//   };


//   // const addToWishlist = (product) => {
//   //   if (!user) {
//   //     toast.warning("Please login first");
//   //     return;
//   //   }

//   //   const exists = wishlistItems.some(
//   //     (item) => item._id === product._id
//   //   );

//   //   if (exists) {
//   //     setWishlistItems((prev) =>
//   //       prev.filter((item) => item._id !== product._id)
//   //     );

//   //     toast.info("Removed from wishlist");
//   //   } else {
//   //     setWishlistItems((prev) => [...prev, product]);

//   //     toast.success("Added to wishlist");
//   //   }
//   // };

//   // const addToWishlist = (product) => {
//   //   const exists = wishlistItems.some((item) => item._id === product._id);

//   //   if (exists) {
//   //     setWishlistItems((prev) =>
//   //       prev.filter((item) => item._id !== product._id),
//   //     );

//   //     toast.info("Removed from wishlist");
//   //   } else {
//   //     setWishlistItems((prev) => [...prev, product]);

//   //     toast.success("Added to wishlist");
//   //   }
//   // };



//   const isInWishlist = (productId) => {
//     return wishlistItems.some((item) => item._id === productId);
//   };

//   return (
//     <AppContext.Provider
//       value={{
//         isAuthReady,

//         isDropdownOpen,
//         setIsDropdownOpen,
//         isSearchBarOpen,
//         setIsSearchBarOpen,

//         user,
//         setUser,

//         cartItems,
//         setCartItems,

//         wishlistItems,
//         setWishlistItems,
//         addToWishlist,
//         isInWishlist,

//         products,
//         setProducts,
//         fetchProducts,

//         subTotal,

//         isUserDetailOpen,
//         setIsUserDetailOpen,

//         isPasswordHidden,
//         setIsPasswordHidden,
//         togglePassword,

//         loading,
//         setLoading,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const useAppContext = () => {
//   const context = useContext(AppContext);

//   if (!context) {
//     throw new Error("useAppContext must be used within an AppProvider");
//   }

//   return context;
// };
