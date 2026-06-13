import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Heart, ShoppingCart } from "lucide-react";
import { useAppContext } from "../context/AppContext";

import Container from "../layout/Container";


const Navbar = () => {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const {
    setIsSearchBarOpen,
    cartItems,
    setCartItems,
    wishlistItems,
    isUserDetailOpen,
    setIsUserDetailOpen,
    user,
    setUser,
  } = useAppContext();

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cartItems");

    setUser(null);
    setCartItems([]);
    setIsUserDetailOpen(false);

    toast.success("Logged out successfully!");

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  // const logoutUser = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("user");

  //   setUser(null);
  //   setIsUserDetailOpen(false);

  //   toast.success("Logged out successfully!");

  //   setTimeout(() => {
  //     navigate("/");
  //   }, 1000);
  // };

  const goToProtectedPage = (path) => {
    if (!user) {
      toast.error("Please login first");
      navigate("/signup?mode=login");
      return;
    }

    navigate(path);
  };

  // const logoutUser = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("user");

  //   setUser(null);
  //   setIsUserDetailOpen(false);
  //   navigate("/");
  // };

  const toggleUserMenu = (e) => {
    e.stopPropagation(); // prevent this click from being seen as an "outside click"
    setIsUserDetailOpen((prev) => !prev);
  };

  // Close dropdown when clicking anywhere outside it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserDetailOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [setIsUserDetailOpen]);

  return (
    <Container>
      <div className="flex items-center py-5 justify-between text-sm font-medium uppercase">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/shopwear.png"
            alt="ShopWear Logo"
            className="w-8 h-8 object-contain brightness-0"
          />

          <h1 className="text-[30px] font-semibold">
            ShopWear
          </h1>
        </Link>

        <ul className="hidden gap-5 text-gray-700 sm:flex">
          <NavLink to="/">
            {({ isActive }) => (
              <>
                Home
                <hr
                  className={`w-2/4 h-[1.5px] mx-auto bg-gray-700 ${isActive ? "block" : "hidden"
                    }`}
                />
              </>
            )}
          </NavLink>

          <NavLink to="/collection">
            {({ isActive }) => (
              <>
                Collection
                <hr
                  className={`w-2/4 h-[1.5px] mx-auto bg-gray-700 ${isActive ? "block" : "hidden"
                    }`}
                />
              </>
            )}
          </NavLink>

          <NavLink to="/about">
            {({ isActive }) => (
              <>
                About
                <hr
                  className={`w-2/4 bg-gray-700 mx-auto h-[0.094rem] ${isActive ? "block" : "hidden"
                    }`}
                />
              </>
            )}
          </NavLink>

          <NavLink to="/contact">
            {({ isActive }) => (
              <>
                Contact
                <hr
                  className={`w-2/4 bg-gray-700 mx-auto h-[0.094rem] ${isActive ? "block" : "hidden"
                    }`}
                />
              </>
            )}
          </NavLink>
        </ul>

        <div className="flex gap-6 items-center">
          <button type="button" onClick={() => setIsSearchBarOpen(true)}>
            <img
              src="/images/search.png"
              className="w-5 cursor-pointer"
              alt="search-icon"
            />
          </button>

          <button
            type="button"
            onClick={() => goToProtectedPage("/wishlist")}
            className="relative cursor-pointer"
          >
            <Heart />

            {user && (
              <p className="rounded-full w-4 h-4 bg-red-600 text-white leading-4 text-[0.7rem] font-semibold text-center absolute bottom-[-0.313rem] right-[-0.313rem]">
                {wishlistItems.length}
              </p>
            )}
          </button>

          <button
            type="button"
            onClick={() => goToProtectedPage("/cart")}
            className="relative cursor-pointer"
          >
            <ShoppingCart />

            {user && (
              <p className="rounded-full w-4 h-4 bg-red-600 text-white leading-4 text-[0.7rem] font-semibold text-center absolute bottom-[-0.313rem] right-[-0.313rem]">
                {cartItems.length}
              </p>
            )}
          </button>

          {/* <Link to="/wishlist">
            <Heart />
          </Link>

          <Link to="/cart" className="relative">
            <ShoppingCart /> */}
          {/* <img src={cart} className="w-5 cursor-pointer" alt="cart-icon" /> */}
          {/* <p className="rounded-full w-4 h-4 bg-black text-white leading-4 text-[0.5rem] text-center absolute bottom-[-0.313rem] right-[-0.313rem]">
              {cartItems.length}
            </p>
          </Link> */}

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <div
                onClick={toggleUserMenu}
                className="bg-gray-200 rounded-full w-8 h-8 flex justify-center items-center cursor-pointer uppercase"
              >
                {user.email?.slice(0, 1)}
              </div>

              {isUserDetailOpen && (
                <div className="absolute rounded top-10 right-0 bg-gray-200 p-4 w-[17rem] z-50 flex flex-col gap-2">
                  <p className="italic mb-1 text-xs normal-case">
                    Logged in as {user.email}
                  </p>

                  <Link
                    to="/profile"
                    onClick={() => setIsUserDetailOpen(false)}
                    className="w-full text-left cursor-pointer bg-white py-1 px-3 normal-case hover:bg-gray-100"
                  >
                    Profile
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setIsUserDetailOpen(false)}
                    className="w-full text-left cursor-pointer bg-white py-1 px-3 normal-case hover:bg-gray-100"
                  >
                    Orders
                  </Link>

                  <button
                    onClick={logoutUser}
                    className="w-full cursor-pointer bg-gray-600 py-1 px-3 text-white normal-case"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/signup?mode=login"
              className="border border-black px-4 py-2 text-black hover:bg-black hover:text-white transition-all duration-300"
            >
              Login
            </Link>
          )}

          {/* Modile response */}
          <img
            src="/images/menu.png"
            className="w-5 cursor-pointer sm:hidden"
            alt="menu-icon"
            onClick={() => setIsMenuOpen(true)}
          />
        </div>

        <div
          className={`absolute sm:hidden top-0 right-0 bottom-0 overflow-hidden bg-white transition-all z-50 ${isMenuOpen ? "w-full" : "w-0"
            }`}
        >
          <div className="flex flex-col text-gray-600">
            <div
              className="flex items-center cursor-pointer gap-4 p-3"
              onClick={() => setIsMenuOpen(false)}
            >
              <img
                src="/images/back-arrow.png"
                className="rotate-180 h-4"
                alt="back-arrow"
              />
              <p>Back</p>
            </div>

            <NavLink
              to="/"
              className={({ isActive }) =>
                `py-2 pl-6 border border-gray-200 uppercase ${isActive ? "bg-black text-white" : ""
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>

            <NavLink
              to="/collection"
              className={({ isActive }) =>
                `py-2 pl-6 border border-gray-200 uppercase ${isActive ? "bg-black text-white" : ""
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Collection
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `py-2 pl-6 border border-gray-200 uppercase ${isActive ? "bg-black text-white" : ""
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `py-2 pl-6 border border-gray-200 uppercase ${isActive ? "bg-black text-white" : ""
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </NavLink>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Navbar;
