import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { axiosInstance } from "../utils/axios";
import { toast } from "react-toastify";

const AppContext = createContext(undefined);

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
  const [cartItems, setCartItems] = useState(() =>
    JSON.parse(localStorage.getItem("cartItems") || "[]"),
  );
  const [wishlistItems, setWishlistItems] = useState(() =>
    JSON.parse(localStorage.getItem("wishlistItems") || "[]"),
  );

  useEffect(() => {
    setIsAuthReady(true);
  }, []);

  useEffect(() => {
    const fetchedProducts = async () => {
      setLoading(true);

      try {
        const res = await axiosInstance.get("/products");

        const productList = res.data.products || res.data.data || res.data;

        setProducts(Array.isArray(productList) ? productList : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchedProducts();
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

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const togglePassword = () => {
    setIsPasswordHidden((prev) => !prev);
  };

  const addToWishlist = (product) => {
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
  };

  // const addToWishlist = (product) => {
  //   const exists = wishlistItems.some((item) => item._id === product._id);

  //   if (exists) {
  //     setWishlistItems((prev) =>
  //       prev.filter((item) => item._id !== product._id),
  //     );
  //   } else {
  //     setWishlistItems((prev) => [...prev, product]);
  //   }
  // };

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

        cartItems,
        setCartItems,

        wishlistItems,
        setWishlistItems,
        addToWishlist,
        isInWishlist,

        products,
        setProducts,

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
// import { axiosInstance } from "./src/utils/axios";

// const GlobalContext = createContext(undefined);

// export const GlobalProvider = ({ children }) => {
//   const savedCartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
//   const savedWishlistItems = JSON.parse(
//     localStorage.getItem("wishlistItems") || "[]",
//   );
//   const savedUser = JSON.parse(localStorage.getItem("user") || "null");

//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
//   const [user, setUser] = useState(savedUser);
//   const [cartItems, setCartItems] = useState(savedCartItems);
//   const [wishlistItems, setWishlistItems] = useState(savedWishlistItems);
//   const [products, setProducts] = useState([]);
//   // const [subTotal, setSubTotal] = useState(0);
//   const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
//   const [isPasswordHidden, setIsPasswordHidden] = useState(true);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchedProducts = async () => {
//       setLoading(true);
//       try {
//         const res = await axiosInstance.get("/products");

//         // unwrap depending on your API's response shape
//         const productList = res.data.products || res.data.data || res.data;

//         setProducts(Array.isArray(productList) ? productList : []);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchedProducts();
//   }, []);

//   // useEffect(() => {
//   //   const fetchedProducts = async () => {
//   //     setLoading(true);
//   //     try {
//   //       const res = await axiosInstance.get("/products");
//   //       setProducts(res.data);
//   //     } catch (err) {
//   //       console.error(err);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };
//   //   fetchedProducts();
//   // }, []);

//   const savedWishlistItems = JSON.parse(
//     localStorage.getItem("wishlistItems") || "[]",
//   );

//   const [wishlistItems, setWishlistItems] = useState(savedWishlistItems);

//   useEffect(() => {
//     localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
//   }, [wishlistItems]);

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

//   // useEffect(() => {
//   //   setSubTotal(
//   //     cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
//   //   );
//   // }, [cartItems]);

//   useEffect(() => {
//     localStorage.setItem("cartItems", JSON.stringify(cartItems));
//   }, [cartItems]);

//   useEffect(() => {
//     localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
//   }, [wishlistItems]);

//   const togglePassword = () => {
//     setIsPasswordHidden(!isPasswordHidden);
//   };

//   const addToWishlist = (product) => {
//     const exists = wishlistItems.some((item) => item._id === product._id);

//     if (exists) {
//       setWishlistItems((prev) =>
//         prev.filter((item) => item._id !== product._id),
//       );
//     } else {
//       setWishlistItems((prev) => [...prev, product]);
//     }
//   };

//   const isInWishlist = (productId) => {
//     return wishlistItems.some((item) => item._id === productId);
//   };

//   return (
//     <GlobalContext.Provider
//       value={{
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
//         subTotal,
//         wishlistItems,
//         setWishlistItems,
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
//     </GlobalContext.Provider>
//   );
// };

// export const useGlobalContext = () => {
//   const context = useContext(GlobalContext);
//   if (!context) {
//     throw new Error("useGlobalContext must be used within a GlobalProvider");
//   }
//   return context;
// };
