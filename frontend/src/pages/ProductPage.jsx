import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useAppContext } from "../context/AppContext";

import Container from "../layout/Container";
import star from "../assets/star_icon.png";
import dullStar from "../assets/star_dull_icon.png";
import Button from "../components/Button";
import { Heart, X } from "lucide-react";
import Loading from "../components/Loading";
import RelatedProducts from "../components/RelatedProducts";
import { getProductById } from "../services/productService";

const ProductPage = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const { user, cartItems, addToWishlist, isInWishlist, addToCart } =
    useAppContext();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", _id],
    queryFn: () => getProductById(_id),
    enabled: !!_id,
  });

  const productImages = Array.isArray(product?.image)
    ? product.image
    : Array.isArray(product?.images)
      ? product.images
      : [];

  const mainImage =
    productImages[selectedImageIndex] ||
    productImages[0] ||
    "/images/placeholder.png";

  const isAddedToCart = cartItems.some((item) => {
    const cartProductId =
      typeof item.productId === "object" ? item.productId?._id : item.productId;

    return (
      (item._id === product?._id || cartProductId === product?._id) &&
      item.size === selectedSize
    );
  });

  const handleWishlist = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    const success = await addToWishlist(product);

    if (!success) {
      setTimeout(() => {
        navigate("/signup?mode=login");
      }, 500);
    }
  };

  const handleAddToCart = async () => {
    if (isAddedToCart) {
      navigate("/cart");
      return;
    }

    const success = await addToCart(product, selectedSize);

    if (!success && !user) {
      setTimeout(() => {
        navigate("/signup?mode=login");
      }, 500);
    }
  };


  return (
    <Container>
      <div className="transition-opacity duration-500 ease-in border-t-2 border-gray-200 opacity-100 pt-10">
        {isLoading ? (
          <div className="flex-1">
            <Loading text="Loading product..." />
          </div>
        ) : isError || !product?._id ? (
          <div className="flex min-h-[36vh] items-center justify-center">
            <p className="col-span-full text-center text-gray-500">
              Product not found
            </p>
          </div>
        ) : (
          <div>
            <div className="flex flex-col gap-12 sm:flex-row">
              <div className="flex flex-col-reverse gap-3 sm:flex-row flex-1">
                <div className="flex sm:flex-col justify-between sm:justify-normal w-full sm:w-[18.7%]">
                  {productImages.slice(0, 4).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={product.name}
                      onClick={() => setSelectedImageIndex(index)}

                      // className="w-[24%] h-28 sm:w-full sm:h-42 object-cover sm:mb-3 flex-shrink-0 cursor-pointer"

                      className={`w-[24%] h-28 sm:w-full sm:h-38 object-contain bg-gray-100 p-1 cursor-pointer ${selectedImageIndex === index
                        ? "border-2 border-gray-600 p-2"
                        : ""
                        }`}
                    />
                  ))}
                </div>

                <div className="relative w-full sm:w-[80%]">
                  <button
                    onClick={(e) => handleWishlist(e, product)}
                    className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:scale-105 transition"
                  >
                    <Heart
                      size={22}
                      className={
                        isInWishlist(product._id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }
                    />
                  </button>


                  <div className="w-full h-125 sm:h-152 bg-gray-100 rounded-lg flex items-center justify-center">
                    <img
                      src={mainImage}
                      alt={product.name}
                      onClick={() => setIsImageModalOpen(true)}
                      className="max-w-full max-h-full object-contain cursor-pointer"
                    />
                  </div>

                  {/* <img
                    src={mainImage}
                    alt={product.name}
                    onClick={() => setIsImageModalOpen(true)}
                    className="w-full h-125 sm:h-177 object-cover rounded-lg cursor-pointer"
                    // className="w-full h-auto"
                  /> */}
                </div>
              </div>

              <div className="flex-1">
                <h1 className="text-2xl font-medium mt-2">{product.name}</h1>

                <div className="flex items-center mt-2 gap-1">
                  <img src={star} className="w-3" alt="star" />
                  <img src={star} className="w-3" alt="star" />
                  <img src={star} className="w-3" alt="star" />
                  <img src={star} className="w-3" alt="star" />
                  <img src={dullStar} className="w-3" alt="star" />
                  <p className="pl-2">122</p>
                </div>

                <p className="text-3xl font-medium mt-5">₹{product.price}</p>

                <div className="flex flex-col gap-4 my-8">
                  <p>Select Size</p>

                  <div className="flex gap-2">
                    {product.sizes?.map((size) => (
                      <Button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        size="tiny"
                        className={`${selectedSize === size
                          ? "border-orange-500"
                          : "border-gray-200"
                          } text-black`}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  size="medium"
                  type="primary"
                  className="w-[28vh]"
                >
                  {isAddedToCart ? "GO TO CART" : "ADD TO CART"}
                  {/* ADD TO CART */}
                </Button>

                <hr className="mt-8 sm:w-4/5 text-gray-200" />

                <div className="flex flex-col gap-1 mt-5 text-sm text-gray-500">
                  <p>Guaranteed 100% Authentic - Shop with Confidence!</p>
                  <p>Enjoy Cash on Delivery - Pay at Your Doorstep!</p>
                  <p>
                    Hassle-Free Returns & Exchanges - 10 Days, No Questions
                    Asked!
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-20">
              <div className="flex">
                <p className="border border-gray-200 font-bold text-sm px-5 py-3">
                  Description
                </p>

                <p className="border border-gray-200 text-sm px-5 py-3">
                  Reviews(122)
                </p>
              </div>

              <div className="flex flex-col border border-gray-200 p-6 gap-4 text-gray-500 text-sm">
                <div className=" text-gray-500 leading-7">
                  <p className=" text-black font-bold text-xl pb-3">
                    Description -
                  </p>

                  <ReactMarkdown>{product.description}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {product?._id && (
        <RelatedProducts
          productId={product._id}
          category={product.category}
          subCategory={product.subCategory}
        />
      )}


      {/* <RelatedProducts
        productId={product?._id}
        category={product?.category}
        subCategory={product?.subCategory}
      /> */}

      {isImageModalOpen && (
        <div
          onClick={() => setIsImageModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-6 right-4 sm:top-8 sm:right-20 z-50 text-white cursor-pointer"
          // className="absolute top-8 right-90 text-white text-4xl"
          >
            <X />
          </button>

          <img
            src={
              productImages[selectedImageIndex] ||
              productImages[0] ||
              "/images/placeholder.png"
            }
            alt={product?.name}
            onClick={(e) => e.stopPropagation()}
            className="h-[85vh] w-auto max-w-[95vw] object-contain rounded-lg"
          // className="max-h-[85vh] max-w-[85vw] object-contain"
          />
        </div>
      )}
    </Container>
  );
};

export default ProductPage;
