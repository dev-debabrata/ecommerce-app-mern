import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";

import Input from "./Input";
import { useAppContext } from "../context/AppContext";

const SearchItem = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const { isSearchBarOpen, setIsSearchBarOpen, products } = useAppContext();

  const closeSearch = () => {
    setSearchInput("");
    setIsSearchBarOpen(false);
  };

  const handleSearch = () => {
    const search = searchInput.trim();

    if (!search) return;

    closeSearch();
    navigate(`/collection?search=${encodeURIComponent(search)}`);
  };

  const searchedProducts = useMemo(() => {
    const search = searchInput.toLowerCase().trim();

    if (!search) return [];

    return products.filter((product) => {
      return (
        product.name?.toLowerCase().includes(search) ||
        product.category?.toLowerCase().includes(search) ||
        product.subCategory?.toLowerCase().includes(search)
      );
    });
  }, [products, searchInput]);

  if (!isSearchBarOpen) return null;

  return (
    <div className="relative flex items-center justify-center border-t border-gray-200 bg-gray-50">
      <div className="mx-3 my-5 flex w-3/4 items-center justify-between rounded-full border border-gray-400 px-5 py-2 sm:w-1/2">
        <Input
          htmlType="text"
          size="large"
          value={searchInput}
          inputClassName="z-50 border-0 bg-inherit text-sm text-gray-700 outline-none"
          placeholder="Search..."
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />

        <button
          type="button"
          className="cursor-pointer text-gray-500"
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

      {searchInput.trim() && (
        <div className="absolute top-[70px] z-50 max-h-80 w-[90%] overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg sm:w-1/2">
          {searchedProducts.length > 0 ? (
            searchedProducts.map((product) => {
              const productImage =
                product.images?.[0] ||
                product.image?.[0] ||
                (typeof product.image === "string" ? product.image : "") ||
                product.image1 ||
                "/images/placeholder.png";

              return (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  onClick={closeSearch}
                  className="flex items-center gap-3 p-3 hover:bg-gray-100"
                >
                  <img
                    src={productImage}
                    alt={product.name}
                    className="h-12 w-12 rounded object-cover"
                  />

                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      ₹{Number(product.price || 0).toFixed(2)}
                    </p>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="p-4 text-center text-sm text-gray-500">
              No products found
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchItem;
