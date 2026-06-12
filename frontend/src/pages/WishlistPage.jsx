import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContext";

import Container from "../layout/Container";
import Title from "../components/Title";
import Button from "../components/Button";


const WishlistPage = () => {
  const { wishlistItems, setWishlistItems } = useAppContext();
  //   const { wishlistItems, setWishlistItems, cartItems, setCartItems } =
  //     useGlobalContext();

  //   const addToCart = (item) => {
  //     const exists = cartItems.find((cartItem) => cartItem._id === item._id);

  //     if (exists) {
  //       toast.info("Already added to cart");

  //       setWishlistItems((prev) =>
  //         prev.filter((wishlistItem) => wishlistItem._id !== item._id),
  //       );

  //       return;
  //     }

  //     setCartItems((prev) => [...prev, { ...item, quantity: 1 }]);

  //     setWishlistItems((prev) =>
  //       prev.filter((wishlistItem) => wishlistItem._id !== item._id),
  //     );

  //     toast.success("Added to cart");
  //   };

  const removeFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter((item) => item._id !== id));

    toast.success("Removed from wishlist");
  };

  return (
    <Container>
      <div className="pt-14 border-t border-gray-200">
        <div className="mb-6 text-2xl">
          <Title text1="MY" text2="WISHLIST" />
        </div>

        {wishlistItems?.length === 0 ? (
          <p className="text-gray-500">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item._id} className="border p-3 rounded-lg ">
                <Link to={`/product/${item._id}`}>
                  <img
                    src={item.images?.[0] || item.image1 || item.image}
                    alt={item.name}
                    className="w-full h-72 object-cover"
                  />

                  <h3 className="mt-2 font-medium">{item.name}</h3>

                  <p className="font-semibold">
                    ${Number(item.price).toFixed(2)}
                  </p>
                </Link>

                <div className="flex gap-2 mt-3">
                  {/* <button
                    onClick={() => addToCart(item)}
                    className="flex-1 bg-black text-white py-2 text-sm rounded cursor-pointer"
                  >
                    Add to Cart
                  </button> */}

                  <Button
                    onClick={() => removeFromWishlist(item._id)}
                    className="px-3 bg-red-500 text-white rounded cursor-pointer"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default WishlistPage;
