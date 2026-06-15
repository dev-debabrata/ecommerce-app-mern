import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Container from "../layout/Container";
import Loading from "../components/Loading";
import { getMyOrders } from "../services/orderService";
import tick from "../assets/tick.jpg";

const TrackOrderPage = () => {
  const { _id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["track-order", _id],
    queryFn: async () => {
      const data = await getMyOrders();
      return data.orders?.find((item) => item._id === _id) || null;
    },
    refetchInterval: 2000,
    refetchOnWindowFocus: true,
    enabled: !!_id,
  });

  const order = data;

  const statusSteps = [
    "Order Placed",
    "Ready for Shipping",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  const currentStatus = order?.orderStatus || "Order Placed";
  const lowerStatus = currentStatus.toLowerCase();

  const isCancelled = lowerStatus === "cancelled";
  const isDelivered = lowerStatus === "delivered";

  const statusColor = isCancelled
    ? "text-red-600"
    : isDelivered
      ? "text-green-600"
      : "text-black";

  const progressColor = isCancelled ? "bg-red-600" : "bg-green-600";

  const currentStepIndex = isCancelled
    ? statusSteps.length - 1
    : Math.max(
      statusSteps.findIndex((step) => step.toLowerCase() === lowerStatus),
      0,
    );

  const progressWidth =
    statusSteps.length === 1
      ? 100
      : (currentStepIndex / (statusSteps.length - 1)) * 100;

  const { shippingDate, formattedDeliveryDate } = useMemo(() => {
    const deliveryDate = new Date(order?.createdAt || new Date());
    deliveryDate.setDate(deliveryDate.getDate() + 3);

    return {
      formattedDeliveryDate: deliveryDate
        .toLocaleString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
        .toUpperCase(),

      shippingDate: deliveryDate
        .toLocaleString("en-GB", {
          month: "long",
          weekday: "long",
          day: "numeric",
        })
        .toUpperCase(),
    };
  }, [order]);

  if (isLoading) return <Loading text="Loading order..." />;

  if (error) {
    return (
      <Container>
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-red-500">Failed to load order.</p>
        </div>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container>
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-gray-500">Order not found.</p>
        </div>
      </Container>
    );
  }

  const items = order.items || [];

  const getProductId = (item) => {
    if (typeof item.productId === "object") {
      return item.productId?._id;
    }

    return item.productId || item._id;
  };

  return (
    <Container>
      <div className="mt-8">
        <h1
          className={`mb-8 text-[2.4rem] font-extralight uppercase ${statusColor}`}
        >
          {currentStatus}
        </h1>

        {isCancelled && (
          <div className="mb-4 inline-block rounded-full bg-red-100 px-4 py-2 font-medium text-red-600">
            Order Cancelled
          </div>
        )}

        {isDelivered && (
          <div className="mb-4 inline-block rounded-full bg-green-100 px-4 py-2 font-medium text-green-600">
            Order Delivered
          </div>
        )}

        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm sm:text-base">
            <span className="font-semibold">Order ID:</span> {order._id}
          </p>

          <p className="mt-2 text-sm sm:text-base">
            <span className="font-semibold">Placed On:</span>{" "}
            {new Date(order.createdAt).toLocaleString("en-IN", {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "numeric",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </p>

          <p className="mt-2 text-sm sm:text-base">
            <span className="font-semibold">Total:</span> ₹{" "}
            {Number(order.totalAmount || 0).toFixed(2)}
          </p>
        </div>

        <div className="border border-gray-400 p-4 sm:px-20 sm:py-8">
          <div className="mb-6 flex flex-col gap-4">
            <span className="text-xs text-[#474747]">
              Expected Delivery Date
            </span>

            <span
              className={`text-[2.2rem] font-light uppercase ${statusColor}`}
            >
              {formattedDeliveryDate}
            </span>
          </div>

          <div className="relative w-full sm:w-[70%]">
            <div className="absolute left-0 top-[10px] h-[8px] w-full rounded-full bg-gray-300" />

            <div
              className={`absolute left-0 top-[10px] h-[8px] rounded-full transition-all duration-700 ${progressColor}`}
              style={{ width: `${progressWidth}%` }}
            />

            <div className="relative flex justify-between">
              {statusSteps.map((status, index) => {
                const completed = index <= currentStepIndex;

                return (
                  <div
                    key={status}
                    className="flex flex-col items-center gap-3"
                  >
                    <div
                      className={`z-10 flex h-7 w-7 items-center justify-center rounded-full ${completed
                        ? isCancelled
                          ? "bg-red-600"
                          : "bg-green-600"
                        : "bg-gray-300"
                        }`}
                    >
                      {completed && (
                        <img src={tick} alt="done" className="h-4 w-4" />
                      )}
                    </div>

                    <p
                      className={`text-center text-[10px] sm:text-xs ${completed
                        ? isCancelled
                          ? "font-medium text-red-600"
                          : "font-medium text-green-600"
                        : "text-gray-400"
                        }`}
                    >
                      {status}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 border border-gray-400">
          <div className="p-4 sm:px-16 sm:py-8">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-medium text-[#474747]">
                SHIPPING HISTORY
              </span>

              <span>
                {shippingDate} AT{" "}
                {new Date(order.createdAt)
                  .toLocaleTimeString("en-GB", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                  .toUpperCase()}
              </span>

              <span className={`font-medium ${statusColor}`}>
                {currentStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 border border-gray-400">
          <h2 className="my-4 ml-4 text-2xl font-light uppercase sm:ml-16">
            Order Details
            <span className="ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-base">
              {items.length}
            </span>
          </h2>

          <div className="flex flex-col gap-6 p-4 sm:px-16 sm:py-8">
            {items.map((item, index) => {
              const productId = getProductId(item);

              return (
                <Link
                  to={`/products/${productId}`}
                  key={`${order._id}-${productId}-${index}`}
                  className="flex gap-4 rounded-md transition hover:bg-gray-50"
                >
                  <img
                    src={item.image || "/images/placeholder.png"}
                    alt={item.name}
                    className="h-40 w-32 object-cover sm:h-48 sm:w-40"
                  />

                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-medium">{item.name}</h3>

                    {item.size && (
                      <p className="text-gray-500">Size: {item.size}</p>
                    )}

                    <p className="text-gray-500">Quantity: {item.quantity}</p>

                    <p className="font-medium">
                      ₹ {Number(item.price || 0).toFixed(2)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default TrackOrderPage;
