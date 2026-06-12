import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContext";

import Container from "../layout/Container";
import Title from "../components/Title";
import binIcon from "../assets/bin_icon.png";
import CartTotal from "../components/CartTotal";
import Input from "../components/Input";


const CartPage = () => {
  const { cartItems, setCartItems, products } = useAppContext();

  const updateQuantity = (productId, size, value) => {
    const quantity = Number(value);

    if (!quantity || quantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId && item.size === size
          ? { ...item, quantity }
          : item,
      ),
    );
  };

  const deleteItemFromCart = (productId, size) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item._id === productId && item.size === size),
      ),
    );

    toast.success("Product deleted successfully");
  };

  return (
    <Container>
      <div className="pt-14 border-t border-t-gray-200">
        <div className="mb-3 text-2xl">
          <Title text1="YOUR" text2="CART" />
        </div>

        {cartItems.length === 0 ? (
          <p className="py-10 text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            {cartItems.map((item) => {
              const latestProduct = products.find(
                (product) => product._id === item._id,
              );

              const currentPrice = latestProduct?.price || item.price || 0;
              const currentName = latestProduct?.name || item.name || "Product";

              const imageUrl =
                latestProduct?.images?.[0] ||
                latestProduct?.image1 ||
                latestProduct?.image ||
                item.images?.[0] ||
                item.image1 ||
                item.image ||
                "/images/placeholder.png";

              return (
                <div
                  key={`${item._id}-${item.size}`}
                  className="border-t border-b border-gray-200 py-4 text-gray-700 grid grid-cols-[4fr_1fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] gap-4 items-center"
                >
                  <div className="flex items-start gap-6">
                    <img
                      src={imageUrl}
                      className="w-16 h-20 object-cover sm:w-20"
                      alt={currentName}
                    />

                    <div>
                      <p className="text-sm font-medium sm:text-lg">
                        {currentName}
                      </p>

                      <div className="flex items-center mt-2 gap-5">
                        <p>${Number(currentPrice).toFixed(2)}</p>

                        <p className="bg-slate-50 border border-gray-200 px-2 sm:px-3 sm:py-1">
                          {item.size}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Input
                    htmlType="number"
                    size="small"
                    min="1"
                    value={item.quantity || 1}
                    onChange={(e) =>
                      updateQuantity(item._id, item.size, e.target.value)
                    }
                  />

                  <img
                    src={binIcon}
                    className="cursor-pointer w-4 mr-4 sm:w-5"
                    alt="bin icon"
                    onClick={() => deleteItemFromCart(item._id, item.size)}
                  />
                </div>
              );
            })}

            <CartTotal />
          </>
        )}
      </div>
    </Container>
  );
};

export default CartPage;

// import { useGlobalContext } from "../../GlobalContext";
// import Title from "../components/Title";
// import Container from "../Container";
// import binIcon from "../assets/bin_icon.png";
// import CartTotal from "../components/CartTotal";
// import { toast } from "react-toastify";
// import Input from "../components/Input";

// const CartPage = () => {
//   const { cartItems, setCartItems } = useGlobalContext();

//   const updateQuantity = (productId, size, value) => {
//     const quantity = Number(value);

//     if (!quantity || quantity < 1) return;

//     setCartItems((prevItems) =>
//       prevItems.map((item) =>
//         item._id === productId && item.size === size
//           ? { ...item, quantity }
//           : item,
//       ),
//     );
//   };

//   const deleteItemFromCart = (productId, size) => {
//     setCartItems((prevItems) =>
//       prevItems.filter(
//         (item) => !(item._id === productId && item.size === size),
//       ),
//     );

//     toast.success("Product deleted successfully");
//   };

//   return (
//     <Container>
//       <div className="pt-14 border-t border-t-gray-200">
//         <div className="mb-3 text-2xl">
//           <Title text1="YOUR" text2="CART" />
//         </div>

//         {cartItems.length === 0 ? (
//           <p className="py-10 text-gray-500">Your cart is empty.</p>
//         ) : (
//           <>
//             {cartItems.map((item) => {
//               const imageUrl =
//                 item.images?.[0] ||
//                 item.image1 ||
//                 item.image ||
//                 "/images/placeholder.png";

//               return (
//                 <div
//                   key={`${item._id}-${item.size}`}
//                   className="border-t border-b border-gray-200 py-4 text-gray-700 grid grid-cols-[4fr_1fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] gap-4 items-center"
//                 >
//                   <div className="flex items-start gap-6">
//                     <img
//                       src={imageUrl}
//                       className="w-16 h-20 object-cover sm:w-20"
//                       alt={item.name}
//                     />

//                     <div>
//                       <p className="text-sm font-medium sm:text-lg">
//                         {item.name}
//                       </p>

//                       <div className="flex items-center mt-2 gap-5">
//                         <p>${Number(item.price || 0).toFixed(2)}</p>

//                         <p className="bg-slate-50 border border-gray-200 px-2 sm:px-3 sm:py-1">
//                           {item.size}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <Input
//                     htmlType="number"
//                     size="small"
//                     min="1"
//                     value={item.quantity || 1}
//                     onChange={(e) =>
//                       updateQuantity(item._id, item.size, e.target.value)
//                     }
//                   />

//                   <img
//                     src={binIcon}
//                     className="cursor-pointer w-4 mr-4 sm:w-5"
//                     alt="bin icon"
//                     onClick={() => deleteItemFromCart(item._id, item.size)}
//                   />
//                 </div>
//               );
//             })}

//             <CartTotal />
//           </>
//         )}
//       </div>
//     </Container>
//   );
// };

// export default CartPage;
