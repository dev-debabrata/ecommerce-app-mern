import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Heart } from "lucide-react";
import { axiosInstance } from "../utils/axios";
import { useAppContext } from "../context/AppContext";

import Container from "../layout/Container";
import Title from "../components/Title";
import Button from "../components/Button";
import Input from "../components/Input";
// import LoadingSpinner from "../components/LoadingSpinner";
import Loading from "../components/Loading";

const CollectionsPage = () => {
  const [products, setProducts] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [sortValue, setSortValue] = useState("name-asc");
  const [searchInput, setSearchInput] = useState("");

  const navigate = useNavigate();

  const { isSearchBarOpen, setIsSearchBarOpen, addToWishlist, isInWishlist } =
    useAppContext();

  const [checkedBox, setCheckedBox] = useState({
    Men: false,
    Women: false,
    Kids: false,
    Topwear: false,
    Bottomwear: false,
    Winterwear: false,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setPageLoading(true);

        const res = await axiosInstance.get("/products");

        const productList = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.products)
            ? res.data.products
            : [];

        setProducts(productList);
      } catch (err) {
        console.error(err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       setPageLoading(true);

  //       const res = await axiosInstance.get("/products");
  //       setProducts(res.data || []);
  //     } catch (err) {
  //       console.error(err);
  //     } finally {
  //       setPageLoading(false);
  //     }
  //   };

  //   fetchProducts();
  // }, []);

  const toggleCheckbox = (e) => {
    const { name, checked } = e.target;

    setCheckedBox((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleWishlist = (e, product) => {
    e.preventDefault();

    const success = addToWishlist(product);

    if (!success) {
      setTimeout(() => {
        navigate("/signup?mode=login");
      }, 500);
    }
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    const search = searchInput.toLowerCase().trim();

    if (search) {
      result = result.filter((product) => {
        return (
          product.name?.toLowerCase().includes(search) ||
          product.category?.toLowerCase().includes(search) ||
          product.subCategory?.toLowerCase().includes(search)
        );
      });
    }

    const isAnyCategoryChecked = Object.values(checkedBox).some(Boolean);

    if (isAnyCategoryChecked) {
      result = result.filter((product) => {
        return checkedBox[product.category] || checkedBox[product.subCategory];
      });
    }

    result.sort((a, b) => {
      if (sortValue === "price-asc") return a.price - b.price;
      if (sortValue === "price-desc") return b.price - a.price;

      if (sortValue === "name-asc") {
        return a.name?.localeCompare(b.name) || 0;
      }

      if (sortValue === "name-desc") {
        return b.name?.localeCompare(a.name) || 0;
      }

      if (sortValue === "createdAt-asc") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      if (sortValue === "createdAt-desc") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      return 0;
    });

    return result;
  }, [products, searchInput, checkedBox, sortValue]);

  const clearFilters = () => {
    setCheckedBox({
      Men: false,
      Women: false,
      Kids: false,
      Topwear: false,
      Bottomwear: false,
      Winterwear: false,
    });

    setSearchInput("");
  };

  const checkboxItems = [
    "Men",
    "Women",
    "Kids",
    "Topwear",
    "Bottomwear",
    "Winterwear",
  ];

  return (
    <Container>
      {isSearchBarOpen && (
        <div className="flex items-center justify-center border-t border-gray-200 bg-gray-50">
          <div className="w-3/4 flex items-center justify-between px-5 py-2 mx-3 my-5 sm:w-1/2 border border-gray-400 rounded-full">
            <Input
              htmlType="text"
              size="large"
              value={searchInput}
              inputClassName="text-sm bg-inherit border-0 outline-none text-gray-700 z-50"
              placeholder="Search..."
              onChange={(e) => setSearchInput(e.target.value)}
            />

            <img src="/images/search.png" className="w-4" alt="search icon" />
          </div>

          <img
            src="/images/search-close.png"
            className="w-3 cursor-pointer"
            alt="search-close"
            onClick={() => setIsSearchBarOpen(false)}
          />
        </div>
      )}

      <div className="flex flex-col pt-10 border-t border-gray-200 gap-1 sm:gap-10 sm:flex-row">
        <div className="min-w-60">
          <p className="flex gap-2 items-center text-xl my-2 cursor-pointer">
            FILTERS
            <img
              src="/images/back-arrow.png"
              className="h-3 sm:hidden"
              alt="back-arrow"
            />
          </p>

          <div className="hidden sm:block border pl-5 py-3 mt-6 border-gray-300">
            <p className="font-medium mb-3 text-sm">CATEGORIES</p>

            <div className="flex flex-col gap-2 text-gray-700 text-sm font-light">
              {checkboxItems.slice(0, 3).map((checkboxItem) => (
                <Input
                  key={checkboxItem}
                  htmlType="checkbox"
                  name={checkboxItem}
                  size="tiny"
                  onChange={toggleCheckbox}
                  checked={checkedBox[checkboxItem]}
                  label={checkboxItem}
                />
              ))}
            </div>
          </div>

          <div className="hidden sm:block gap-2 border pl-5 py-3 my-5 mt-6 border-gray-300 text-sm">
            <p className="font-medium mb-3 text-sm">TYPES</p>

            <div className="flex flex-col gap-2 text-gray-700 text-sm font-light">
              {checkboxItems.slice(3).map((checkboxItem) => (
                <Input
                  key={checkboxItem}
                  htmlType="checkbox"
                  name={checkboxItem}
                  size="tiny"
                  onChange={toggleCheckbox}
                  checked={checkedBox[checkboxItem]}
                  label={checkboxItem}
                />
              ))}
            </div>
          </div>

          <Button
            onClick={clearFilters}
            type="primary"
            size="small"
            className="hidden sm:block mt-1 rounded px-4"
          >
            Clear Filters
          </Button>
        </div>

        <div className="flex-1">
          <div className="flex justify-between text-base mb-2 sm:text-2xl">
            <div className="flex items-center mb-3 gap-2">
              <Title text1="All" text2="Collections" />
            </div>

            <select
              value={sortValue}
              onChange={(e) => setSortValue(e.target.value)}
              className="border-2 text-sm h-9 px-2 cursor-pointer border-gray-300"
            >
              <option value="name-asc">Sort by: Name Asc</option>
              <option value="name-desc">Sort by: Name Desc</option>
              <option value="price-asc">Sort by: Low to High</option>
              <option value="price-desc">Sort by: High to Low</option>
              <option value="createdAt-asc">Sort by: Oldest</option>
              <option value="createdAt-desc">Sort by: Newest</option>
            </select>
          </div>

          {pageLoading ? (
            <Loading text="Loading collections..." />
          ) : filteredProducts.length === 0 ? (
            <div className="flex min-h-[50vh] items-center justify-center">
              <p className="text-lg text-gray-500">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 gap-y-6 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <Link to={`/products/${product._id}`} key={product._id}>
                  {/* <div className="flex flex-col cursor-pointer overflow-hidden"> */}
                  <div className="relative flex flex-col cursor-pointer overflow-hidden">
                    <button
                      onClick={(e) => handleWishlist(e, product)}
                      className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md"
                    >
                      <Heart
                        size={20}
                        className={
                          isInWishlist(product._id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-600"
                        }
                      />
                    </button>
                    <img
                      src={
                        Array.isArray(product?.image)
                          ? product.image[0]
                          : "/images/placeholder.png"
                      }
                      className="transition ease-in-out hover:scale-110"
                      alt={product.name}
                    />
                    {/* <img
                      src={product.images?.[0]}
                      className="transition ease-in-out hover:scale-110"
                      alt={product.name}
                    /> */}

                    <p className="text-sm pt-3 pb-1 text-[#374151]">
                      {product.name}
                    </p>

                    <p className="text-sm font-medium text-[#374151]">
                      ${Number(product.price || 0).toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default CollectionsPage;
