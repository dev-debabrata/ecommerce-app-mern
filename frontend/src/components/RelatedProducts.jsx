import { useMemo } from "react";
import ProductItem from "./ProductItem";
import Title from "./Title";
import Loading from "./Loading";
import { useAppContext } from "../context/AppContext";

const RelatedProducts = ({ productId, category, subCategory }) => {
  const { products, productsLoading } = useAppContext();

  const relatedProducts = useMemo(() => {
    if (!products?.length || !category) return [];

    let filtered = products.filter(
      (item) => item._id !== productId && item.category === category,
    );

    if (subCategory) {
      filtered = filtered.filter((item) => item.subCategory === subCategory);
    }

    return filtered.slice(0, 5);
  }, [products, productId, category, subCategory]);

  return (
    <div className="my-24">
      <div className="py-2 text-3xl text-center">
        <Title text1="RELATED" text2="PRODUCTS" />
      </div>

      {productsLoading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <Loading text="Loading products..." />
        </div>
      ) : relatedProducts.length === 0 ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <p className="text-gray-500">No related products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
          {relatedProducts.map((product) => (
            <ProductItem key={product._id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
