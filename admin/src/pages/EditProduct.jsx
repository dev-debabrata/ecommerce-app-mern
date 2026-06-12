import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { assets } from "../assets/assets";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const EditProduct = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubcategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const [existingImages, setExistingImages] = useState([]); // URLs from server
  const [image1, setImage1] = useState(false); // new files (or false = no change)
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const product = data.product || data;

        setName(product.name || "");
        setDescription(product.description || "");
        setPrice(product.price || "");
        setCategory(product.category || "Men");
        setSubcategory(product.subCategory || "Topwear");
        setBestseller(!!product.bestSeller);
        setSizes(product.sizes || []);
        setExistingImages(product.images || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, token]);

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Only append new image files if user selected one
      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestSeller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      const { data } = await axios.put(
        `${backendUrl}/api/products/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(data.message || "Product updated successfully");
      navigate("/list");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update product");
    }
  };

  if (loading) {
    return (
      <p className="text-center py-10 text-gray-500">Loading product...</p>
    );
  }

  // Helper: what to show for each image slot
  // Priority: newly selected file > existing image from server > upload placeholder
  const getImageSrc = (newFile, existingUrl) => {
    if (newFile) return URL.createObjectURL(newFile);
    if (existingUrl) return existingUrl;
    return assets.upload_area;
  };

  return (
    <main>
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col w-full items-start gap-3"
      >
        <p className="font-semibold text-lg">Edit Product</p>

        <div>
          <p className="mb-2 font-medium text-sm">Product Images</p>
          <p className="text-xs text-gray-400 mb-2">
            Click an image to replace it. Leave unchanged to keep the existing
            image.
          </p>
          <div className="flex gap-2">
            <label htmlFor="image1">
              <img
                className="w-20 h-20 object-cover border"
                src={getImageSrc(image1, existingImages[0])}
                alt="product slot 1"
              />
              <input
                onChange={(e) => setImage1(e.target.files[0])}
                type="file"
                id="image1"
                hidden
              />
            </label>
            <label htmlFor="image2">
              <img
                className="w-20 h-20 object-cover border"
                src={getImageSrc(image2, existingImages[1])}
                alt="product slot 2"
              />
              <input
                onChange={(e) => setImage2(e.target.files[0])}
                type="file"
                id="image2"
                hidden
              />
            </label>
            <label htmlFor="image3">
              <img
                className="w-20 h-20 object-cover border"
                src={getImageSrc(image3, existingImages[2])}
                alt="product slot 3"
              />
              <input
                onChange={(e) => setImage3(e.target.files[0])}
                type="file"
                id="image3"
                hidden
              />
            </label>
            <label htmlFor="image4">
              <img
                className="w-20 h-20 object-cover border"
                src={getImageSrc(image4, existingImages[3])}
                alt="product slot 4"
              />
              <input
                onChange={(e) => setImage4(e.target.files[0])}
                type="file"
                id="image4"
                hidden
              />
            </label>
          </div>
        </div>

        <div className="w-full">
          <p className="mb-2 font-medium text-sm">Product Name</p>
          <input
            name="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full max-w-[500px] px-3 py-2 border"
            type="text"
            placeholder="Type here"
            required
          />
        </div>

        <div className="w-full">
          <p className="mb-2 font-medium text-sm">Product Description</p>
          <textarea
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full max-w-[500px] px-3 py-2 border"
            placeholder="Write product description"
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:gap-6 gap-2 w-full">
          <div>
            <p className="mb-2 font-medium text-sm">Product Category</p>
            <select
              className="w-full px-3 py-2 border"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div>
            <p className="mb-2 font-medium text-sm">Product SubCategory</p>
            <select
              className="w-full px-3 py-2 border"
              value={subCategory}
              onChange={(e) => setSubcategory(e.target.value)}
            >
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>

          <div>
            <p className="mb-2 font-medium text-sm">Product Price</p>
            <input
              name="price"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="w-full max-w-[500px] px-3 py-2 border"
              type="number"
              required
            />
          </div>
        </div>

        <div>
          <p className="mb-2 font-medium text-sm">Product Sizes</p>
          <div className="flex gap-2.5">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <div key={size} onClick={() => toggleSize(size)}>
                <p
                  className={`${
                    sizes.includes(size) ? "bg-pink-100" : "bg-pink-200"
                  } px-3 py-1 cursor-pointer`}
                >
                  {size}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <input
            type="checkbox"
            id="bestseller"
            checked={bestseller}
            onChange={() => setBestseller((prev) => !prev)}
          />
          <label htmlFor="bestseller">Add to bestseller</label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="uppercase bg-black text-white px-3 py-3 rounded"
          >
            Update Product
          </button>
          <button
            type="button"
            onClick={() => navigate("/list")}
            className="uppercase border border-gray-400 px-3 py-3 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
};

export default EditProduct;

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { backendUrl } from "../App";
// import { toast } from "react-toastify";

// const EditProduct = ({ token }) => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [category, setCategory] = useState("Men");
//   const [subCategory, setSubcategory] = useState("Topwear");
//   const [bestseller, setBestseller] = useState(false);
//   const [sizes, setSizes] = useState([]);
//   const [existingImages, setExistingImages] = useState([]);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const { data } = await axios.get(`${backendUrl}/api/products/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const product = data.product || data;

//         setName(product.name || "");
//         setDescription(product.description || "");
//         setPrice(product.price || "");
//         setCategory(product.category || "Men");
//         setSubcategory(product.subCategory || "Topwear");
//         setBestseller(!!product.bestSeller);
//         setSizes(product.sizes || []);
//         setExistingImages(product.images || []);
//       } catch (error) {
//         console.error(error);
//         toast.error("Failed to load product");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchProduct();
//   }, [id, token]);

//   const toggleSize = (size) => {
//     setSizes((prev) =>
//       prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
//     );
//   };

//   const onSubmitHandler = async (e) => {
//     e.preventDefault();

//     try {
//       const { data } = await axios.put(
//         `${backendUrl}/api/products/${id}`,
//         {
//           name,
//           description,
//           price: Number(price),
//           category,
//           subCategory,
//           bestSeller: bestseller,
//           sizes,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         },
//       );

//       toast.success(data.message || "Product updated successfully");
//       navigate("/list");
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || "Failed to update product");
//     }
//   };

//   if (loading) {
//     return (
//       <p className="text-center py-10 text-gray-500">Loading product...</p>
//     );
//   }

//   return (
//     <main>
//       <form
//         onSubmit={onSubmitHandler}
//         className="flex flex-col w-full items-start gap-3"
//       >
//         <p className="font-semibold text-lg">Edit Product</p>

//         {existingImages.length > 0 && (
//           <div>
//             <p className="mb-2 font-medium text-sm">Current Images</p>
//             <div className="flex gap-2">
//               {existingImages.map((img, idx) => (
//                 <img
//                   key={idx}
//                   src={img}
//                   alt={`product-${idx}`}
//                   className="w-20 h-20 object-cover border"
//                 />
//               ))}
//             </div>
//             <p className="text-xs text-gray-400 mt-1">
//               Image editing not supported yet — update text fields only.
//             </p>
//           </div>
//         )}

//         <div className="w-full">
//           <p className="mb-2 font-medium text-sm">Product Name</p>
//           <input
//             name="name"
//             onChange={(e) => setName(e.target.value)}
//             value={name}
//             className="w-full max-w-[500px] px-3 py-2 border"
//             type="text"
//             placeholder="Type here"
//             required
//           />
//         </div>

//         <div className="w-full">
//           <p className="mb-2 font-medium text-sm">Product Description</p>
//           <textarea
//             name="description"
//             onChange={(e) => setDescription(e.target.value)}
//             value={description}
//             className="w-full max-w-[500px] px-3 py-2 border"
//             placeholder="Write product description"
//             required
//           />
//         </div>

//         <div className="flex flex-col sm:flex-row sm:gap-6 gap-2 w-full">
//           <div>
//             <p className="mb-2 font-medium text-sm">Product Category</p>
//             <select
//               className="w-full px-3 py-2 border"
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//             >
//               <option value="Men">Men</option>
//               <option value="Women">Women</option>
//               <option value="Kids">Kids</option>
//             </select>
//           </div>

//           <div>
//             <p className="mb-2 font-medium text-sm">Product SubCategory</p>
//             <select
//               className="w-full px-3 py-2 border"
//               value={subCategory}
//               onChange={(e) => setSubcategory(e.target.value)}
//             >
//               <option value="Topwear">Topwear</option>
//               <option value="Bottomwear">Bottomwear</option>
//               <option value="Winterwear">Winterwear</option>
//             </select>
//           </div>

//           <div>
//             <p className="mb-2 font-medium text-sm">Product Price</p>
//             <input
//               name="price"
//               onChange={(e) => setPrice(e.target.value)}
//               value={price}
//               className="w-full max-w-[500px] px-3 py-2 border"
//               type="number"
//               required
//             />
//           </div>
//         </div>

//         <div>
//           <p className="mb-2 font-medium text-sm">Product Sizes</p>
//           <div className="flex gap-2.5">
//             {["S", "M", "L", "XL", "XXL"].map((size) => (
//               <div key={size} onClick={() => toggleSize(size)}>
//                 <p
//                   className={`${
//                     sizes.includes(size) ? "bg-pink-100" : "bg-pink-200"
//                   } px-3 py-1 cursor-pointer`}
//                 >
//                   {size}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="flex gap-2 mt-2">
//           <input
//             type="checkbox"
//             id="bestseller"
//             checked={bestseller}
//             onChange={() => setBestseller((prev) => !prev)}
//           />
//           <label htmlFor="bestseller">Add to bestseller</label>
//         </div>

//         <div className="flex gap-3">
//           <button
//             type="submit"
//             className="uppercase bg-black text-white px-3 py-3 rounded"
//           >
//             Update Product
//           </button>
//           <button
//             type="button"
//             onClick={() => navigate("/list")}
//             className="uppercase border border-gray-400 px-3 py-3 rounded"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </main>
//   );
// };

// export default EditProduct;
