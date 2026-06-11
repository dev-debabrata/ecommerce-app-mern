import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import API from "./src/utils/Api";

const GlobalContext = createContext(undefined);

export const GlobalProvider = ({ children }) => {
  const savedCartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const [cartItems, setCartItems] = useState(savedCartItems);
  const [products, setProducts] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchedProducts = async () => {
      setLoading(true);
      try {
        const res = await API.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchedProducts();
  }, []);

  useEffect(() => {
    setSubTotal(
      cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    );
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const togglePassword = () => {
    setIsPasswordHidden(!isPasswordHidden);
  };

  return (
    <GlobalContext.Provider
      value={{
        isDropdownOpen,
        setIsDropdownOpen,
        isSearchBarOpen,
        setIsSearchBarOpen,
        cartItems,
        setCartItems,
        products,
        setProducts,
        subTotal,
        setSubTotal,
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
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};