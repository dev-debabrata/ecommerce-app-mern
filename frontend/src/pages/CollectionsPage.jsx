import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

import Container from "../layout/Container";
import Title from "../components/Title";
import Button from "../components/Button";
import Input from "../components/Input";
import Loading from "../components/Loading";
import ProductItem from "../components/ProductItem";
import { Search, X } from "lucide-react";

const initialCheckedBox = {
  Men: false,
  Women: false,
  Kids: false,
  Topwear: false,
  Bottomwear: false,
  Winterwear: false,
};

const checkboxItems = [
  "Men",
  "Women",
  "Kids",
  "Topwear",
  "Bottomwear",
  "Winterwear",
];

const CollectionsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [sortValue, setSortValue] = useState("name-asc");
  const [searchInput, setSearchInput] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [checkedBox, setCheckedBox] = useState(initialCheckedBox);

  const {
    products,
    loading,
    isSearchBarOpen,
    setIsSearchBarOpen,
    addToWishlist,
    isInWishlist,
  } = useAppContext();

  useEffect(() => {
    const search = searchParams.get("search") || "";
    setSearchInput(search);
  }, [searchParams]);

  const closeSearch = () => {
    setSearchInput("");
    setSearchParams({});
    setIsSearchBarOpen(false);
  };

  const handleSearch = () => {
    const search = searchInput.trim();

    if (!search) {
      setSearchParams({});
      return;
    }

    setSearchParams({ search });
    setIsSearchBarOpen(false);
  };

  const toggleCheckbox = (e) => {
    const { name, checked } = e.target;

    setCheckedBox((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

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
      const priceA = Number(a.price || 0);
      const priceB = Number(b.price || 0);

      if (sortValue === "price-asc") return priceA - priceB;
      if (sortValue === "price-desc") return priceB - priceA;

      if (sortValue === "name-asc") {
        return (a.name || "").localeCompare(b.name || "");
      }

      if (sortValue === "name-desc") {
        return (b.name || "").localeCompare(a.name || "");
      }

      if (sortValue === "createdAt-asc") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }

      if (sortValue === "createdAt-desc") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }

      return 0;
    });

    return result;
  }, [products, searchInput, checkedBox, sortValue]);

  const clearFilters = () => {
    setCheckedBox(initialCheckedBox);
    setSearchInput("");
    setSearchParams({});
  };


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
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />

            <button
              type="button"
              className="w-4 text-gray-500"
              onClick={handleSearch}
            >
              <Search size={20} />
            </button>
          </div>

          <button
            type="button"
            className="cursor-pointer text-gray-500"
            onClick={closeSearch}
          >
            <X size={20} />
          </button>
        </div>
      )}

      <div className="flex flex-col pt-10 border-t border-gray-200 gap-1 sm:gap-10 sm:flex-row">
        <div className="min-w-60">
          <p
            onClick={() => setShowFilter((prev) => !prev)}
            className="flex gap-2 items-center text-xl my-2 cursor-pointer"
          >
            FILTERS
            <img
              src="/images/back-arrow.png"
              className={`h-3 sm:hidden transition-transform ${showFilter ? "rotate-90" : ""
                }`}
              alt="back-arrow"
            />
          </p>

          <div
            className={`border pl-5 py-3 mt-6 border-gray-300 ${showFilter ? "block" : "hidden"
              } sm:block`}
          >
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

          {/* <div className="hidden sm:block gap-2 border pl-5 py-3 my-5 mt-6 border-gray-300 text-sm"> */}
          <div
            className={`gap-2 border pl-5 py-3 my-5 mt-6 border-gray-300 text-sm ${showFilter ? "block" : "hidden"
              } sm:block`}
          >
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
            className={`${showFilter ? "block" : "hidden"} sm:block mt-1 rounded px-4`}
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

          {loading ? (
            <Loading text="Loading collections..." />
          ) : filteredProducts.length === 0 ? (
            <div className="flex min-h-[50vh] items-center justify-center">
              <p className="text-lg text-gray-500">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 gap-y-6 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductItem
                  key={product._id}
                  {...product}
                  showWishlist={true}
                  isWishlisted={isInWishlist(product._id)}
                  onWishlist={(e) => handleWishlist(e, product)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default CollectionsPage;
