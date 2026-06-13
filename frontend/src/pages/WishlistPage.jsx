import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContext";

import Container from "../layout/Container";
import Title from "../components/Title";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";

const WishlistPage = () => {
  const { wishlistItems, setWishlistItems } = useAppContext();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [wishlistItems]);

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

        {loading ? (
          <div className=" flex-1">
            <Loading text="Loading wishlist..." />
          </div>
        ) : wishlistItems?.length === 0 ? (
          <div className="flex min-h-[36vh] items-center justify-center">
            <p className="text-lg text-gray-500">Your wishlist is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item._id} className="border p-3 rounded-lg">
                <Link to={`/products/${item._id}`}>
                  <img
                    src={
                      Array.isArray(item.image)
                        ? item.image[0]
                        : item.images?.[0] ||
                          item.image1 ||
                          "/images/placeholder.png"
                    }
                    alt={item.name}
                    className="w-full h-72 object-cover"
                  />

                  <h3 className="mt-2 font-medium">{item.name}</h3>

                  <p className="font-semibold">
                    ${Number(item.price || 0).toFixed(2)}
                  </p>
                </Link>

                <div className="flex justify-end gap-2 mt-3">
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

        {/* {wishlistItems?.length === 0 ? (
          <p className="text-gray-500">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item._id} className="border p-3 rounded-lg">
                <Link to={`/products/${item._id}`}>
                  <img
                    src={
                      Array.isArray(item.image)
                        ? item.image[0]
                        : item.images?.[0] ||
                          item.image1 ||
                          "/images/placeholder.png"
                    }
                    alt={item.name}
                    className="w-full h-72 object-cover"
                  />

                  <h3 className="mt-2 font-medium">{item.name}</h3>

                  <p className="font-semibold">
                    ${Number(item.price || 0).toFixed(2)}
                  </p>
                </Link>

                <div className="flex justify-end gap-2 mt-3">
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
        )} */}
      </div>
    </Container>
  );
};

export default WishlistPage;
