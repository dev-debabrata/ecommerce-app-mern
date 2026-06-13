import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../utils/axios";
import { useAppContext } from "../context/AppContext";

import Container from "../layout/Container";
import star from "../assets/star_icon.png";
import dullStar from "../assets/star_dull_icon.png";
import Title from "../components/Title";
import Button from "../components/Button";
import { Heart } from "lucide-react";
import Loading from "../components/Loading";

const ProductPage = () => {
  const { _id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const {
    cartItems,
    setCartItems,
    products,
    user,
    addToWishlist,
    isInWishlist,
  } = useAppContext();

  const navigate = useNavigate();

  // const { cartItems, setCartItems, products } = useAppContext();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const { data } = await axiosInstance.get(`/products/${_id}`);

        const fetchedProduct = data.product || data;

        if (!fetchedProduct?._id) {
          setProduct(null);
          return;
        }

        setProduct(fetchedProduct);
        setSelectedImageIndex(0);
      } catch (error) {
        console.error(error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (_id) {
      fetchProduct();
    }
  }, [_id]);

  const productImages = Array.isArray(product?.image) ? product.image : [];

  const handleWishlist = (e, product) => {
    e.preventDefault();

    const success = addToWishlist(product);

    if (!success) {
      setTimeout(() => {
        navigate("/signup?mode=login");
      }, 500);
    }
  };

  const addToCart = (productId) => {
    if (!selectedSize) {
      toast.warning("Please Select a Size");
      return;
    }

    if (!user) {
      toast.error("Please login first");

      setTimeout(() => {
        navigate("/signup?mode=login");
      }, 500);

      return;
    }

    const alreadyInCart = cartItems.find(
      (item) => item._id === productId && item.size === selectedSize,
    );

    if (alreadyInCart) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === productId && item.size === selectedSize
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        ),
      );

      toast.info("Product updated");
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          ...product,
          quantity: 1,
          size: selectedSize,
          createdAt: new Date().toISOString(),
        },
      ]);

      toast.success("Product added to cart");
    }
  };

  // if (loading) {
  //   return (
  //     <Container>
  //       <Loading text="Loading product..." />
  //     </Container>
  //   );
  // }

  // if (!product) {
  //   return (
  //     <Container>
  //       <div className="py-20 text-center text-gray-500">Product not found</div>
  //     </Container>
  //   );
  // }

  return (
    <Container>
      <div className="transition-opacity duration-500 ease-in border-t-2 border-gray-200 opacity-100 pt-10">
        {loading ? (
          <div className="flex-1">
            <Loading text="Loading product..." />
          </div>
        ) : !product ? (
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
                      className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer ${
                        selectedImageIndex === index
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

                  <img
                    src={
                      productImages[selectedImageIndex] ||
                      productImages[0] ||
                      "/images/placeholder.png"
                    }
                    alt={product.name}
                    className="w-full h-auto"
                  />
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

                <p className="text-3xl font-medium mt-5">${product.price}</p>

                <div className="flex flex-col gap-4 my-8">
                  <p>Select Size</p>

                  <div className="flex gap-2">
                    {product.sizes?.map((size) => (
                      <Button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        size="tiny"
                        className={`${
                          selectedSize === size
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
                  onClick={() => addToCart(product._id)}
                  size="medium"
                  type="primary"
                  className="w-[28vh]"
                >
                  ADD TO CART
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

                {/* <div className="mt-5 text-gray-500 leading-7">
                  <p className=" text-black font-bold text-xl  py-3">
                    Description -
                  </p>

                  <ReactMarkdown>{product.description}</ReactMarkdown>
                </div> */}

                {/* <p className="mt-5 text-gray-500">{product.description}</p> */}
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
                {/* <p>
                  Elevate your style with our meticulously crafted Trendify
                  quality products.
                </p>

                <p>
                  Whether you're dressing up for a special occasion or adding a
                  touch of sophistication to your everyday look.
                </p> */}
              </div>
            </div>
          </div>
        )}

        <div className="mt-20">
          <div className="my-24">
            <div className="text-3xl text-center py-2">
              <Title text1="RELATED" text2="PRODUCTS" />
            </div>

            {loading ? (
              <div className="flex-1">
                <Loading text="Loading product..." />
              </div>
            ) : !product ? (
              <div className="flex min-h-[30vh] items-center justify-center">
                <p className="col-span-full text-center text-gray-500">
                  Product not found
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {products
                  .filter(
                    (relatedProduct) =>
                      relatedProduct.category === product.category,
                  )
                  .slice(0, 5)
                  .map((relatedProduct) => (
                    <Link
                      key={relatedProduct._id}
                      to={`/product/${relatedProduct._id}`}
                      className="overflow-hidden"
                    >
                      <img
                        src={
                          relatedProduct?.image?.[0] ||
                          "/images/placeholder.png"
                        }
                        alt={relatedProduct?.name}
                        className="transition ease-in-out hover:scale-110"
                      />
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ProductPage;

// import { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { axiosInstance } from "../utils/axios";
// import { useAppContext } from "../context/AppContext";

// import Container from "../layout/Container";
// import star from "../assets/star_icon.png";
// import dullStar from "../assets/star_dull_icon.png";
// import Title from "../components/Title";
// import Button from "../components/Button";

// const ProductPage = () => {
//   const { _id } = useParams();

//   const [product, setProduct] = useState(null);
//   const [mainImage, setMainImage] = useState("");
//   const [selectedSize, setSelectedSize] = useState("");

//   const { cartItems, setCartItems, products } = useAppContext();

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const { data } = await axiosInstance.get(`/products/${_id}`);

//         const fetchedProduct = data.product || data;

//         setProduct(fetchedProduct);

//         const firstImage =
//           fetchedProduct?.image?.[0] ||
//           fetchedProduct?.images?.[0] ||
//           "";

//         // const firstImage =
//         //   fetchedProduct?.images?.[0] || fetchedProduct?.image || "";

//         setMainImage(firstImage);
//       } catch (error) {
//         console.error(error);
//         toast.error("Product not found");
//       }
//     };

//     if (_id) {
//       fetchProduct();
//     }
//   }, [_id]);

//   const productImages =
//     product?.image || product?.images || [];

//   // const productImages = product?.images?.length
//   //   ? product.images
//   //   : product?.image
//   //     ? [product.image]
//   //     : [];

//   const addToCart = (productId) => {
//     if (!selectedSize) {
//       toast.warning("Please Select a Size");
//       return;
//     }

//     const alreadyInCart = cartItems.find(
//       (item) => item._id === productId && item.size === selectedSize,
//     );

//     if (alreadyInCart) {
//       setCartItems((prevItems) =>
//         prevItems.map((item) =>
//           item._id === productId && item.size === selectedSize
//             ? {
//               ...item,
//               quantity: item.quantity + 1,
//             }
//             : item,
//         ),
//       );

//       toast.info("Product updated");
//     } else if (product) {
//       setCartItems((prev) => [
//         ...prev,
//         {
//           ...product,
//           quantity: 1,
//           size: selectedSize,
//           createdAt: new Date().toISOString(),
//         },
//       ]);

//       toast.success("Product added to cart");
//     }
//   };

//   return (
//     <Container>
//       <div className="transition-opacity duration-500 ease-in border-t-2 border-gray-200 opacity-100 pt-10">
//         <div className="flex flex-col gap-12 sm:flex-row">
//           <div className="flex flex-col-reverse gap-3 sm:flex-row flex-1">
//             <div className="flex sm:flex-col justify-between sm:justify-normal w-full sm:w-[18.7%]">
//               {productImages.slice(0, 4).map((image, index) => (
//                 <img
//                   src={image}
//                   key={`${image}-${index}`}
//                   className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer ${mainImage === image
//                     ? "border-2 border-gray-600 p-2"
//                     : "border-none"
//                     }`}
//                   alt={product?.name || "product"}
//                   onClick={() => setMainImage(image)}
//                 />
//               ))}
//             </div>
//             <div className="w-full sm:w-[80%]">
//               <img
//                 src={mainImage || "/images/placeholder.png"}
//                 className="w-full h-auto"
//                 alt={product?.name || "product"}
//               />
//             </div>
//           </div>
//           <div className="flex-1">
//             <h1 className="text-2xl font-medium mt-2">{product?.name}</h1>
//             <div className="flex items-center mt-2 gap-1">
//               <img src={star} className="w-3" alt="star" />
//               <img src={star} className="w-3" alt="star" />
//               <img src={star} className="w-3" alt="star" />
//               <img src={star} className="w-3" alt="star" />
//               <img src={dullStar} className="w-3" alt="star" />
//               <p className="pl-2">122</p>
//             </div>
//             <p className="text-3xl font-medium mt-5">${product?.price}</p>
//             <p className="mt-5 text-gray-500">{product?.description}</p>
//             <div className="flex flex-col gap-4 my-8">
//               <p>Select Size</p>
//               <div className="flex gap-2">
//                 {product?.sizes?.map((size) => {
//                   return (
//                     <Button
//                       key={size}
//                       onClick={() => setSelectedSize(size)}
//                       size="tiny"
//                       className={`${selectedSize === size
//                         ? "border-orange-500"
//                         : "border-gray-200"
//                         } text-black`}
//                     >
//                       {size}
//                     </Button>
//                   );
//                 })}
//               </div>
//             </div>
//             {product && (
//               <Button
//                 onClick={() => addToCart(product._id)}
//                 size="medium"
//                 type="primary"
//                 className="w-[28vh]"
//               >
//                 ADD TO CART
//               </Button>
//             )}
//             <hr className=" mt-8 sm:w-4/5 text-gray-200" />
//             <div className="flex flex-col gap-1 mt-5 text-sm text-gray-500">
//               <p>Guaranteed 100% Authentic - Shop with Confidence!</p>
//               <p>Enjoy Cash on Delivery - Pay at Your Doorstep!</p>
//               <p>
//                 Hassle-Free Returns &amp; Exchanges - 10 Days, No Questions
//                 Asked!
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="mt-20">
//           <div className="flex">
//             <p className="border border-gray-200 font-bold text-sm px-5 py-3">
//               Description
//             </p>
//             <p className="border border-gray-200 text-sm px-5 py-3">
//               Reviews(122)
//             </p>
//           </div>
//           <div className="flex flex-col border border-gray-200 p-6 gap-4 text-gray-500 text-sm">
//             <p>
//               Elevate your style with our meticulously crafted Trendify quality
//               products. Designed with a perfect balance of elegance and
//               practicality, these Trendify quality products made from premium
//               materials that ensure both durability and comfort.
//             </p>
//             <p>
//               Whether you're dressing up for a special occasion or adding a
//               touch of sophistication to your everyday look, the Trendify
//               quality products offer unparalleled versatility. Its timeless
//               design, coupled with a flawless fit, makes it a must-have addition
//               to any wardrobe. Don't miss out on the chance to own a piece that
//               combines both form and function—experience the difference today.
//             </p>
//           </div>
//           <div className="my-24">
//             <div className="text-3xl text-center py-2">
//               <Title text1="RELATED" text2="PRODUCTS" />
//             </div>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
//               {products
//                 .filter(
//                   (relatedProduct) =>
//                     relatedProduct.category === product?.category,
//                 )
//                 .slice(0, 5)
//                 .map((relatedProduct) => {
//                   return (
//                     <Link
//                       to={`/product/${relatedProduct._id}`}
//                       className="overflow-hidden"
//                       key={relatedProduct._id}
//                     >
//                       <img
//                         src={
//                           relatedProduct?.image?.[0] ||
//                           relatedProduct?.images?.[0] ||
//                           "/images/placeholder.png"
//                         }
//                         className="transition ease-in-out hover:scale-110"
//                         alt={relatedProduct?.name || "product"}
//                       />
//                     </Link>
//                   );
//                 })}
//             </div>
//           </div>
//         </div>
//       </div>
//     </Container>
//   );
// };

// export default ProductPage;
