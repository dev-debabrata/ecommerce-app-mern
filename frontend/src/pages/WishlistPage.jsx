import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

import Container from "../layout/Container";
import Title from "../components/Title";
import Loading from "../components/Loading";
import { Trash2 } from "lucide-react";

const WishlistPage = () => {
  const {
    wishlistItems,
    addToWishlist,
    userDataLoading,
  } = useAppContext();


  const wishlist = wishlistItems || [];

  const removeFromWishlist = async (e, item) => {
    e.preventDefault();
    e.stopPropagation();

    await addToWishlist(item);
  };

  return (
    <Container>
      <div className="pt-14 border-t border-gray-200">
        <div className="mb-6 text-2xl">
          <Title text1="MY" text2="WISHLIST" />
        </div>

        {userDataLoading ? (
          <div className="flex-1">
            <Loading text="Loading wishlist..." />
          </div>
        ) : wishlist?.length === 0 ? (
          <div className="flex min-h-[36vh] items-center justify-center">
            <p className="text-lg text-gray-500">Your wishlist is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div key={item._id} className="border p-3 rounded-lg">
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => removeFromWishlist(e, item)}
                    className="absolute top-3 right-3 z-20 p-2 bg-red-500 text-white hover:bg-red-600 rounded-full shadow-md cursor-pointer"
                  >
                    <Trash2 size={20} />
                  </button>

                  <Link to={`/products/${item._id}`}>
                    <div className="w-full h-38 sm:h-72 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={
                          Array.isArray(item.image)
                            ? item.image[0]
                            : item.images?.[0] ||
                            item.image1 ||
                            "/images/placeholder.png"
                        }
                        alt={item.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>

                    <h3 className="mt-2 text-[10px] sm:text-sm font-medium">
                      {item.name}
                    </h3>

                    <p className="font-semibold">
                      ₹{Number(item.price || 0).toFixed(2)}
                    </p>
                  </Link>

                  {/* <Link to={`/products/${item._id}`}>
                    <img
                      src={
                        Array.isArray(item.image)
                          ? item.image[0]
                          : item.images?.[0] ||
                          item.image1 ||
                          "/images/placeholder.png"
                      }
                      alt={item.name}
                      className="w-full h-40 sm:h-100 object-cover"
                    />

                    <h3 className="mt-2 text-[10px] sm:text-sm font-medium">
                      {item.name}
                    </h3>

                    <p className="font-semibold">
                      ₹{Number(item.price || 0).toFixed(2)}
                    </p>
                  </Link> */}
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
