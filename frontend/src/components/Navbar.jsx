import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Heart, Search, ShoppingCart } from "lucide-react";
import { useAppContext } from "../context/AppContext";

import Container from "../layout/Container";
import SearchItem from "./SearchItem";
import { useQueryClient } from "@tanstack/react-query";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const {
    setIsSearchBarOpen,
    cartItems,
    wishlistItems,
    isUserDetailOpen,
    setIsUserDetailOpen,
    user,
    setUser,
    setCartItems,
    setWishlistItems,
  } = useAppContext();

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setCartItems([]);
    setWishlistItems([]);
    setIsUserDetailOpen(false);

    queryClient.removeQueries({ queryKey: ["userData"] });
    queryClient.removeQueries({ queryKey: ["addresses"] });
    queryClient.removeQueries({ queryKey: ["orders"] });

    toast.success("Logged out successfully!");
    navigate("/");
  };

  const goToProtectedPage = (path) => {
    if (!user) {
      toast.error("Please login first");
      navigate("/signup?mode=login");
      return;
    }

    navigate(path);
  };

  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setIsUserDetailOpen((prev) => !prev);
  };

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
            className=" w-6 h-6 md:w-8 md:h-8 object-contain brightness-0"
          />

          <h1 className="md:text-[30px] text-lg  font-semibold">ShopWear</h1>
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

        <div className="flex gap-4 md:gap-6 items-center">
          <button
            type="button"
            onClick={() => setIsSearchBarOpen(true)}
            className=" cursor-pointer"
          >
            <Search />
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

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={toggleUserMenu}
                className="grid h-8 w-8 place-items-center rounded-full bg-gray-200 text-sm font-semibold uppercase cursor-pointer"
              >
                {user.email?.charAt(0)}
              </button>

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
              className="border border-black text-[12px] px-2 py-1 md:text-base md:px-4 md:py-2 text-black hover:bg-black hover:text-white transition-all duration-300"
            >
              Login
            </Link>
          )}

          {/* Modile response */}
          <button
            type="button"
            className="cursor-pointer sm:hidden"
            onClick={() => setIsMenuOpen(true)}
          >
            <img src="/images/menu.png" className="w-5" alt="menu-icon" />
          </button>
        </div>

        <div
          className={`fixed bottom-0 right-0 top-0 z-50 overflow-hidden bg-white transition-all sm:hidden ${isMenuOpen ? "w-full" : "w-0"
            }`}
        >
          <div className="flex flex-col text-gray-600">
            <button
              type="button"
              className="flex cursor-pointer items-center gap-4 p-3"
              onClick={() => setIsMenuOpen(false)}
            >
              <img
                src="/images/back-arrow.png"
                className="h-4 rotate-180"
                alt="back-arrow"
              />
              <p>Back</p>
            </button>

            {[
              { path: "/", label: "Home" },
              { path: "/collection", label: "Collection" },
              { path: "/about", label: "About" },
              { path: "/contact", label: "Contact" },
            ].map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `border border-gray-200 py-2 pl-6 uppercase ${isActive ? "bg-black text-white" : ""
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

      </div>

      {location.pathname !== "/collection" && <SearchItem />}
    </Container>
  );
};

export default Navbar;
