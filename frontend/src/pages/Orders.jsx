import { Link } from "react-router-dom";

import Container from "../layout/Container";
import Title from "../components/Title";
import Button from "../components/Button";
import { getMyOrders } from "../services/orderService";
import Loading from "../components/Loading";
import { useQuery } from "@tanstack/react-query";

const Orders = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-orders"],
    queryFn: getMyOrders,
    refetchInterval: 2000,
    refetchOnWindowFocus: true,
  });

  const orders = data?.orders || [];


  const getStatusColor = (status = "") => {
    const lowerStatus = status.toLowerCase();

    if (lowerStatus === "cancelled") {
      return {
        dot: "bg-red-500",
        text: "text-red-600",
        bg: "bg-red-50",
      };
    }

    if (lowerStatus === "delivered") {
      return {
        dot: "bg-green-500",
        text: "text-green-600",
        bg: "bg-green-50",
      };
    }

    return {
      dot: "bg-orange-500",
      text: "text-orange-600",
      bg: "bg-orange-50",
    };
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <Container>
      <div className="pt-14 border-t border-t-gray-200">
        <div className="mb-6 text-2xl">
          <Title text1="YOUR" text2="ORDERS" />
        </div>

        {isLoading ? (
          <div className="flex-1">
            <Loading text="Loading orders..." />
          </div>
        ) : error ? (
          <p className="text-red-500">Failed to load orders.</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => {
              const status = order.orderStatus || "Ready for Shipping";
              const statusStyle = getStatusColor(status);
              const items = order.items || [];

              return (
                <div
                  key={order._id}
                  className="border border-gray-300 rounded-lg overflow-hidden bg-white"
                >
                  <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex flex-col gap-2">
                        <p className="text-sm sm:text-base">
                          <span className="font-semibold">Order ID:</span>{" "}
                          {order._id}
                        </p>

                        <p className="text-sm sm:text-base">
                          <span className="font-semibold">Placed On:</span>{" "}
                          {formatDate(order.createdAt)}
                        </p>

                        <p className="text-sm sm:text-base">
                          <span className="font-semibold">Total:</span> ₹{" "}
                          {Number(order.totalAmount || 0).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex flex-col items-start gap-3 sm:items-end">
                        <div
                          className={`flex items-center gap-2 rounded-full px-3 py-1 ${statusStyle.bg}`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${statusStyle.dot}`}
                          />
                          <span
                            className={`text-sm font-medium ${statusStyle.text}`}
                          >
                            {status}
                          </span>
                        </div>

                        <Link to={`/trackorder/${order._id}`}>
                          <Button
                            type="transparent"
                            size="small"
                            className="bg-transparent px-3"
                          >
                            TRACK ORDER
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <h3 className="mb-4 font-semibold uppercase">Products</h3>

                    <div className="flex flex-col gap-5">
                      {items.map((item, index) => (
                        <Link
                          to={`/products/${item.productId}`}
                          className="block hover:bg-gray-50 transition rounded-md"
                        >
                          <div
                            key={`${order._id}-${item.productId}-${index}`}
                            className="flex gap-4 border-b border-gray-100 pb-5 last:border-b-0 last:pb-0"
                          >
                            <img
                              src={item.image || "/images/placeholder.png"}
                              className="h-28 w-20 object-cover sm:h-36 sm:w-28"
                              alt={item.name}
                            />

                            <div className="flex flex-1 flex-col gap-2">
                              <p className="font-medium text-sm sm:text-base">
                                {item.name}
                              </p>

                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity}
                              </p>

                              {item.size && (
                                <p className="text-sm text-gray-600">
                                  Size: {item.size}
                                </p>
                              )}

                              <p className="font-semibold">
                                ₹{Number(item.price || 0).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Container>
  );
};

export default Orders;
