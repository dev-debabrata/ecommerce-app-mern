import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { SquarePen, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

import { backendUrl, currency } from "../App";
import Loading from "../components/Loading";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [subCategory, setSubCategory] = useState("All");
  const [discountFilter, setDiscountFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`${backendUrl}/api/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setList(data.products || data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getProductImage = (item) => {
    if (Array.isArray(item.image)) return item.image[0];
    if (Array.isArray(item.images)) return item.images[0];
    return item.image || item.image1 || "/placeholder.png";
  };

  const getDiscountPrice = (price, discount) => {
    return Number(price || 0) - (Number(price || 0) * Number(discount || 0)) / 100;
  };

  const categories = useMemo(() => {
    return ["All", ...new Set(list.map((item) => item.category).filter(Boolean))];
  }, [list]);

  const subCategories = useMemo(() => {
    return ["All", ...new Set(list.map((item) => item.subCategory).filter(Boolean))];
  }, [list]);

  const filteredList = useMemo(() => {
    return list.filter((item) => {
      const matchesSearch = item.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory = category === "All" || item.category === category;
      const matchesSubCategory =
        subCategory === "All" || item.subCategory === subCategory;

      const hasDiscount = Number(item.discount || 0) > 0;

      const matchesDiscount =
        discountFilter === "All" ||
        (discountFilter === "With Discount" && hasDiscount) ||
        (discountFilter === "No Discount" && !hasDiscount);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubCategory &&
        matchesDiscount
      );
    });
  }, [list, search, category, subCategory, discountFilter]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  const paginatedProducts = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const removeProduct = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`,
    );

    if (!confirmed) return;

    try {
      const { data } = await axios.delete(`${backendUrl}/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(data.message || "Product removed");
      fetchList();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove product");
    }
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setSubCategory("All");
    setDiscountFilter("All");
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, subCategory, discountFilter]);

  return (
    <main className="w-full">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold">All Products List</h2>

        <p className="text-sm text-gray-500">
          Showing {paginatedProducts.length} of {filteredList.length} products
        </p>
      </div>

      <div className="mb-5 grid gap-3 rounded-lg border border-gray-200 bg-white p-4 md:grid-cols-5">
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "All" ? "All Categories" : cat}
            </option>
          ))}
        </select>

        <select
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
        >
          {subCategories.map((sub) => (
            <option key={sub} value={sub}>
              {sub === "All" ? "All Sub Categories" : sub}
            </option>
          ))}
        </select>

        <select
          value={discountFilter}
          onChange={(e) => setDiscountFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
        >
          <option value="All">All Discount</option>
          <option value="With Discount">With Discount</option>
          <option value="No Discount">No Discount</option>
        </select>

        <button
          type="button"
          onClick={resetFilters}
          className="cursor-pointer rounded-md bg-black px-4 py-2 text-sm text-white transition hover:bg-gray-800"
        >
          Reset
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-[1400px] text-left text-sm">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Sub Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3">Discount Price</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="py-20 text-center text-gray-500">
                  <Loading text="Loading products..." />
                </td>
              </tr>
            ) : paginatedProducts.length > 0 ? (
              paginatedProducts.map((item, index) => (
                <tr
                  key={item._id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium">
                    {filteredList.length -
                      ((currentPage - 1) * itemsPerPage + index)}
                  </td>

                  <td className="px-4 py-3">
                    <img
                      src={getProductImage(item)}
                      alt={item.name}
                      className="h-14 w-14 rounded-md object-cover"
                    />
                  </td>

                  <td className="px-4 py-3 font-medium text-gray-800">
                    {item.name}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {item.category || "-"}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {item.subCategory || "-"}
                  </td>

                  <td className="px-4 py-3 font-medium">
                    {currency}
                    {Number(item.price || 0).toFixed(2)}
                  </td>

                  <td className="px-4 py-3 font-medium text-orange-600">
                    {item.discount ? `${item.discount}%` : "-"}
                  </td>

                  <td className="px-4 py-3 font-medium text-green-600">
                    {item.discount ? (
                      <>
                        {currency}
                        {getDiscountPrice(item.price, item.discount).toFixed(2)}
                      </>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-4">
                      <Link
                        to={`/edit/${item._id}`}
                        className="text-blue-500 transition hover:text-blue-700"
                        title="Edit product"
                      >
                        <SquarePen size={20} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => removeProduct(item._id, item.name)}
                        className="text-red-500 transition hover:text-red-700"
                        title="Delete product"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="py-8 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages || 1}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="cursor-pointer rounded-md border border-gray-300 p-2 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="cursor-pointer rounded-md border border-gray-300 p-2 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default List;



// import { useCallback, useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { SquarePen, Trash2 } from "lucide-react";

// import { backendUrl, currency } from "../App";
// import Loading from "../components/Loading";

// const List = ({ token }) => {
//   const [list, setList] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("All");
//   const [subCategory, setSubCategory] = useState("All");
//   const [discountFilter, setDiscountFilter] = useState("All");

//   const fetchList = useCallback(async () => {
//     try {
//       setLoading(true);

//       const { data } = await axios.get(`${backendUrl}/api/products`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setList(data.products || data || []);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to fetch products");
//     } finally {
//       setLoading(false);
//     }
//   }, [token]);

//   const getProductImage = (item) => {
//     if (Array.isArray(item.image)) return item.image[0];
//     if (Array.isArray(item.images)) return item.images[0];
//     return item.image || item.image1 || "/placeholder.png";
//   };

//   const getDiscountPrice = (price, discount) => {
//     return (
//       Number(price || 0) - (Number(price || 0) * Number(discount || 0)) / 100
//     );
//   };

//   const categories = useMemo(() => {
//     return [
//       "All",
//       ...new Set(list.map((item) => item.category).filter(Boolean)),
//     ];
//   }, [list]);

//   const subCategories = useMemo(() => {
//     return [
//       "All",
//       ...new Set(list.map((item) => item.subCategory).filter(Boolean)),
//     ];
//   }, [list]);

//   const filteredList = useMemo(() => {
//     return list.filter((item) => {
//       const matchesSearch = item.name
//         ?.toLowerCase()
//         .includes(search.toLowerCase());

//       const matchesCategory = category === "All" || item.category === category;

//       const matchesSubCategory =
//         subCategory === "All" || item.subCategory === subCategory;

//       const hasDiscount = Number(item.discount || 0) > 0;

//       const matchesDiscount =
//         discountFilter === "All" ||
//         (discountFilter === "With Discount" && hasDiscount) ||
//         (discountFilter === "No Discount" && !hasDiscount);

//       return (
//         matchesSearch &&
//         matchesCategory &&
//         matchesSubCategory &&
//         matchesDiscount
//       );
//     });
//   }, [list, search, category, subCategory, discountFilter]);

//   const removeProduct = async (id, name) => {
//     const confirmed = window.confirm(
//       `Are you sure you want to delete "${name}"?`,
//     );

//     if (!confirmed) return;

//     try {
//       const { data } = await axios.delete(`${backendUrl}/api/products/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       toast.success(data.message || "Product removed");
//       fetchList();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to remove product");
//     }
//   };

//   const resetFilters = () => {
//     setSearch("");
//     setCategory("All");
//     setSubCategory("All");
//     setDiscountFilter("All");
//   };

//   useEffect(() => {
//     fetchList();
//   }, [fetchList]);

//   return (
//     <main className="w-full">
//       <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//         <h2 className="text-xl font-semibold">All Products List</h2>

//         <p className="text-sm text-gray-500">
//           Showing {filteredList.length} of {list.length} products
//         </p>
//       </div>

//       <div className="mb-5 grid gap-3 rounded-lg border border-gray-200 bg-white p-4 md:grid-cols-5">
//         <input
//           type="text"
//           placeholder="Search product..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
//         />

//         <select
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
//         >
//           {categories.map((cat) => (
//             <option key={cat} value={cat}>
//               {cat === "All" ? "All Categories" : cat}
//             </option>
//           ))}
//         </select>

//         <select
//           value={subCategory}
//           onChange={(e) => setSubCategory(e.target.value)}
//           className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
//         >
//           {subCategories.map((sub) => (
//             <option key={sub} value={sub}>
//               {sub === "All" ? "All Sub Categories" : sub}
//             </option>
//           ))}
//         </select>

//         <select
//           value={discountFilter}
//           onChange={(e) => setDiscountFilter(e.target.value)}
//           className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
//         >
//           <option value="All">All Discount</option>
//           <option value="With Discount">With Discount</option>
//           <option value="No Discount">No Discount</option>
//         </select>

//         <button
//           type="button"
//           onClick={resetFilters}
//           className="rounded-md bg-black px-4 py-2 text-sm text-white transition hover:bg-gray-800 cursor-pointer"
//         >
//           Reset
//         </button>
//       </div>

//       {/* <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
//         <table className="w-full min-w-[900px] text-left text-sm"> */}
//       <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
//         <table className="min-w-[1400px] text-left text-sm">
//           <thead className="bg-gray-200 text-gray-700">
//             <tr>
//               <th className="px-4 py-3">ID</th>
//               <th className="px-4 py-3">Image</th>
//               <th className="px-4 py-3">Name</th>
//               <th className="px-4 py-3">Category</th>
//               <th className="px-4 py-3">Sub Category</th>
//               <th className="px-4 py-3">Price</th>
//               <th className="px-4 py-3">Discount</th>
//               <th className="px-4 py-3">Discount Price</th>
//               <th className="px-4 py-3 text-center">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan="9" className="py-20 text-center text-gray-500">
//                   <Loading text="Loading products..." />
//                 </td>
//               </tr>
//             ) : filteredList.length > 0 ? (
//               filteredList.map((item, index) => (
//                 <tr
//                   key={item._id}
//                   className="border-t border-gray-200 hover:bg-gray-50"
//                 >
//                   <td className="px-4 py-3 font-medium">
//                     {filteredList.length - index}
//                   </td>

//                   <td className="px-4 py-3">
//                     <img
//                       src={getProductImage(item)}
//                       alt={item.name}
//                       className="h-14 w-14 rounded-md object-cover"
//                     />
//                   </td>

//                   <td className="px-4 py-3 font-medium text-gray-800">
//                     {item.name}
//                   </td>

//                   <td className="px-4 py-3 text-gray-600">
//                     {item.category || "-"}
//                   </td>

//                   <td className="px-4 py-3 text-gray-600">
//                     {item.subCategory || "-"}
//                   </td>

//                   <td className="px-4 py-3 font-medium">
//                     {currency}
//                     {Number(item.price || 0).toFixed(2)}
//                   </td>

//                   <td className="px-4 py-3 font-medium text-orange-600">
//                     {item.discount ? `${item.discount}%` : "-"}
//                   </td>

//                   <td className="px-4 py-3 font-medium text-green-600">
//                     {item.discount ? (
//                       <>
//                         {currency}
//                         {getDiscountPrice(item.price, item.discount).toFixed(2)}
//                       </>
//                     ) : (
//                       "-"
//                     )}
//                   </td>

//                   <td className="px-4 py-3">
//                     <div className="flex items-center justify-center gap-4">
//                       <Link
//                         to={`/edit/${item._id}`}
//                         className="text-blue-500 transition hover:text-blue-700"
//                         title="Edit product"
//                       >
//                         <SquarePen size={20} />
//                       </Link>

//                       <button
//                         type="button"
//                         onClick={() => removeProduct(item._id, item.name)}
//                         className="text-red-500 transition hover:text-red-700"
//                         title="Delete product"
//                       >
//                         <Trash2 size={20} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="9" className="py-8 text-center text-gray-500">
//                   No products found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </main>
//   );
// };

// export default List;


// import { useCallback, useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { SquarePen, Trash2 } from "lucide-react";

// import { backendUrl, currency } from "../App";
// import Loading from "../components/Loading";

// const List = ({ token }) => {
//   const [list, setList] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchList = useCallback(async () => {
//     try {
//       setLoading(true);

//       const { data } = await axios.get(`${backendUrl}/api/products`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setList(data.products || data || []);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to fetch products");
//     } finally {
//       setLoading(false);
//     }
//   }, [token]);

//   const getProductImage = (item) => {
//     if (Array.isArray(item.image)) return item.image[0];
//     if (Array.isArray(item.images)) return item.images[0];
//     return item.image || item.image1 || "/placeholder.png";
//   };

//   const removeProduct = async (id, name) => {
//     const confirmed = window.confirm(
//       `Are you sure you want to delete "${name}"?`,
//     );

//     if (!confirmed) return;

//     try {
//       const { data } = await axios.delete(`${backendUrl}/api/products/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       toast.success(data.message || "Product removed");
//       fetchList();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to remove product");
//     }
//   };

//   useEffect(() => {
//     fetchList();
//   }, [fetchList]);

//   return (
//     <main className="w-full">
//       <h2 className="mb-5 text-xl font-semibold">All Products List</h2>

//       <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
//         <table className="w-full min-w-[800px] text-left text-sm">
//           <thead className="bg-gray-100 text-gray-700">
//             <tr>
//               <th className="px-4 py-3">ID</th>
//               <th className="px-4 py-3">Image</th>
//               <th className="px-4 py-3">Name</th>
//               <th className="px-4 py-3">Category</th>
//               <th className="px-4 py-3">Sub Category</th>
//               <th className="px-4 py-3">Price</th>
//               <th className="px-4 py-3 text-center">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan="7" className="py-20 text-center text-gray-500">
//                   <Loading text="Loading products..." />
//                 </td>
//               </tr>
//             ) : list.length > 0 ? (
//               list.map((item, index) => (
//                 <tr
//                   key={item._id}
//                   className="border-t border-gray-200 hover:bg-gray-50"
//                 >
//                   <td className="px-4 py-3 font-medium">
//                     {" "}
//                     {list.length - index}
//                   </td>
//                   <td className="px-4 py-3">
//                     <img
//                       src={getProductImage(item)}
//                       alt={item.name}
//                       className="h-14 w-14 rounded-md object-cover"
//                     />
//                   </td>

//                   <td className="px-4 py-3 font-medium text-gray-800">
//                     {item.name}
//                   </td>

//                   <td className="px-4 py-3 text-gray-600">
//                     {item.category || "-"}
//                   </td>

//                   <td className="px-4 py-3 text-gray-600">
//                     {item.subCategory || "-"}
//                   </td>

//                   <td className="px-4 py-3 font-medium">
//                     {currency}
//                     {Number(item.price || 0).toFixed(2)}
//                   </td>

//                   <td className="px-4 py-3">
//                     <div className="flex items-center justify-center gap-4">
//                       <Link
//                         to={`/edit/${item._id}`}
//                         className="text-blue-500 transition hover:text-blue-700"
//                         title="Edit product"
//                       >
//                         <SquarePen size={20} />
//                       </Link>

//                       <button
//                         type="button"
//                         onClick={() => removeProduct(item._id, item.name)}
//                         className="text-red-500 transition hover:text-red-700"
//                         title="Delete product"
//                       >
//                         <Trash2 size={20} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="7" className="py-8 text-center text-gray-500">
//                   No products available
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </main>
//   );
// };

// export default List;
