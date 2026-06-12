import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/ContactPage";
import CollectionsPage from "./pages/CollectionsPage";
import SignUpPage from "./pages/SignUpPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import Orders from "./pages/Orders";
import TrackOrderPage from "./pages/TrackOrderPage";
import Checkout from "./pages/Checkout";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import WishlistPage from "./pages/WishlistPage";
import { useAppContext } from "./context/AppContext";


function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

function App() {
  const { user, isAuthReady } = useAppContext();
  // const location = useLocation();

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, [location.pathname]);


  if (!isAuthReady) return null;

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/collection" element={<CollectionsPage />} />
        <Route path="/product/:_id" element={<ProductPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Auth routes — redirect to home if already logged in */}
        <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" />} />

        {/* Protected routes — redirect to signup if not logged in */}
        <Route path="/wishlist" element={user ? <WishlistPage /> : <Navigate to="/signup" />} />
        <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/signup" />} />
        <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/signup" />} />
        <Route path="/orders" element={user ? <Orders /> : <Navigate to="/signup" />} />
        <Route path="/trackorder/:_id" element={user ? <TrackOrderPage /> : <Navigate to="/signup" />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;


// import { Route, Routes, useLocation } from "react-router-dom";
// import { useEffect } from "react";
// import { ToastContainer } from "react-toastify";

// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";

// import Home from "./pages/Home";
// import About from "./pages/About";
// import Contact from "./pages/ContactPage";
// import CollectionsPage from "./pages/CollectionsPage";
// import SignUpPage from "./pages/SignUpPage";
// import ProductPage from "./pages/ProductPage";
// import CartPage from "./pages/CartPage";
// import Orders from "./pages/Orders";
// import TrackOrderPage from "./pages/TrackOrderPage";
// import Checkout from "./pages/Checkout";
// import ForgotPassword from "./pages/ForgotPassword";
// import ResetPassword from "./pages/ResetPassword";
// import WishlistPage from "./pages/WishlistPage";

// function App() {
//   const location = useLocation();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [location.pathname]);

//   return (
//     <>
//       <Navbar />
//       <ToastContainer position="bottom-right" autoClose={3000} />

//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/collection" element={<CollectionsPage />} />
//         <Route path="/signup" element={<SignUpPage />} />
//         <Route path="/product/:_id" element={<ProductPage />} />
//         <Route path="/wishlist" element={<WishlistPage />} />
//         <Route path="/cart" element={<CartPage />} />
//         <Route path="/checkout" element={<Checkout />} />
//         <Route path="/orders" element={<Orders />} />
//         <Route path="/trackorder/:_id" element={<TrackOrderPage />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/reset-password/:token" element={<ResetPassword />} />
//       </Routes>

//       <Footer />
//     </>
//   );
// }

// export default App;
