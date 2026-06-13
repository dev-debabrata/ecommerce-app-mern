import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

import "../index.css";
import Container from "../layout/Container";
import Title from "../components/Title";
// import LoadingSpinner from "../components/LoadingSpinner";
import Loading from "../components/Loading";

const Home = () => {
  const { products, setIsUserDetailOpen, loading } = useAppContext();

  useEffect(() => {
    setIsUserDetailOpen(false);
  }, [setIsUserDetailOpen]);

  const getProductImage = (product) => {
    return (
      product?.image?.[0] || product?.images?.[0] || "/images/placeholder.png"
    );
  };

  const renderProducts = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
      return (
        <p className="col-span-full py-10 text-center text-gray-500">
          No products found
        </p>
      );
    }

    return items.slice(0, 10).map((product) => (
      <Link
        to={`/products/${product._id}`}
        key={product._id}
        className="flex overflow-hidden flex-col justify-between h-full text-gray-700 cursor-pointer"
      >
        <img
          className="hover:scale-110 transition ease-in-out"
          src={getProductImage(product)}
          alt={product.name || "product"}
        />

        <p className="text-sm pb-1 pt-3">{product.name}</p>

        <p className="text-sm font-medium">
          ₹{Number(product.price || 0).toFixed(2)}
        </p>
      </Link>
    ));
  };

  return (
    <Container>
      <div className="flex flex-col sm:flex-row border border-gray-400">
        <div className="py-10 sm:py-0 sm:w-1/2 flex flex-col items-center justify-center lg:text-5xl w-full">
          <div>
            <div className="flex items-center gap-2">
              <p className="w-8 md:w-11 font-bold h-[0.125rem] bg-[#414141]"></p>
              <p className="uppercase font-medium text-sm md:text-base text-[#414141]">
                our best sellers
              </p>
            </div>

            <h1 className="text-3xl leading-relaxed prata-regular text-[#414141] font-normal lg:text-5xl">
              Latest Arrivals
            </h1>

            <div className="flex items-center gap-2">
              <p className="uppercase font-semibold text-[#414141] text-sm md:text-base">
                Shop now
              </p>
              <p className="w-8 md:w-11 font-bold h-[0.063rem] bg-[#414141]"></p>
            </div>
          </div>
        </div>

        <img src="/images/hero-img.png" className="sm:w-1/2" alt="hero-img" />
      </div>

      <div className="my-10">
        <div className="py-8 flex flex-col justify-center items-center">
          <div className="mb-3 flex items-center gap-1 uppercase">
            <p className="text-gray-500 sm:text-[#6B7280] text-2xl sm:text-3xl">
              Latest
            </p>

            <span className="flex items-center gap-1 text-gray-700 font-medium text-2xl sm:text-3xl">
              Collections
              <p className="w-8 sm:w-12 h-[0.063rem] sm:h-[0.125rem] bg-gray-700 sm:bg-[#374151]"></p>
            </span>
          </div>

          <p className="text-xs sm:text-sm md:text-base mx-9 sm:mx-32 text-[#4B5563] text-center">
            Step into a world of style with our newest collections, carefully
            curated to bring you the best in fashion, home decor, and more.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex-1">
          <Loading text="Loading product..." />
        </div>
      ) : (
        // <LoadingSpinner />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {renderProducts(products)}
        </div>
      )}

      <div className="my-10">
        <div className="py-8 text-center text-3xl">
          <Title text1="Best" text2="sellers" />

          <p className="w-3/4 text-gray-600 text-xs sm:text-sm md:text-base mx-auto">
            Our best sellers are a curated selection of top-rated items that
            have won over shoppers with their quality, style, and value.
          </p>
        </div>

        {loading ? (
          <div className="flex-1">
            <Loading text="Loading product..." />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
            {renderProducts(products)}
          </div>
        )}
      </div>

      <div className="flex flex-col py-8 justify-around gap-12 text-xs text-gray-700 text-center sm:text-sm md:text-base sm:flex-row sm:gap-2">
        <div>
          <img
            className="m-auto mb-3 w-12"
            src="/images/return-icon.png"
            alt="return"
          />
          <p className="font-semibold mb-2">Easy Return & Exchange Policy</p>
          <p className="text-gray-400">
            Easy Returns/exchanges within 10 days.
          </p>
        </div>

        <div>
          <img
            className="m-auto mb-3 w-12"
            src="/images/quality-icon.png"
            alt="quality-icon"
          />
          <p className="font-semibold mb-2">Our Quality Policy</p>
          <p>Trendify ensures top-quality products.</p>
        </div>

        <div>
          <img
            className="m-auto mb-3 w-12"
            src="/images/earphone.png"
            alt="earphone"
          />
          <p className="font-semibold mb-2">Best Customer Support</p>
          <p className="text-gray-400">We support via email, phone, or chat.</p>
        </div>
      </div>
    </Container>
  );
};

export default Home;
