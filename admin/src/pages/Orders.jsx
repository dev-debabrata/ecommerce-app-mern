import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/orders/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(data.orders || []);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    }
  }, [token]);

  const handleStatus = async (e, orderId) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/orders/admin/status/${orderId}`,
        { orderStatus: e.target.value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        toast.success("Status updated");
        fetchAllOrders();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  return (
    <main>
      <h1>Order page</h1>

      <div>
        {orders.map((order) => {
          const userName =
            order.userId?.name ||
            `${order.address?.firstName || ""} ${order.address?.lastName || ""}`;

          const userEmail =
            order.userId?.email || order.address?.emailAddress || "No email";

          return (
            <div
              key={order._id}
              className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2.5fr_1fr_0.5fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
            >
              <img
                className="w-12"
                src={assets.parcel_icon}
                alt="parcel icon"
              />

              <div>
                <p className="mb-2 text-[18px] font-bold text-black">
                  Order ID: {order._id}
                </p>

                <div>
                  {order.items.map((item, i) => (
                    <p className="py-0.5 text-orange-500" key={i}>
                      {item.name} x {item.quantity} <span>{item.size}</span>
                      {i !== order.items.length - 1 ? "," : ""}
                    </p>
                  ))}
                </div>

                <div className="mt-3 mb-2 rounded bg-gray-50">
                  <p className="text-[18px] font-bold text-black">
                    Customer Details
                  </p>
                  <p>Name: {userName}</p>
                  <p>Email: {userEmail}</p>
                </div>

                <div className="mt-3 mb-2 rounded bg-gray-50">
                  <p className="font-semibold text-base text-black">
                    Address:-
                  </p>
                  <p className=" font-medium">
                    {order.address?.firstName + " " + order.address?.lastName}
                  </p>

                  <div>
                    <p>{order.address?.street + ","}</p>
                    <p>
                      {order.address?.city +
                        ", " +
                        order.address?.state +
                        ", " +
                        order.address?.country +
                        ", " +
                        order.address?.zipCode}
                    </p>
                  </div>
                </div>

                <p>{order.address?.mobile}</p>
              </div>

              <div>
                <p className="text-sm sm:text-[15px]">
                  Items: {order.items.length}
                </p>
                <p className="mt-3">
                  Method: {order.paymentMethod?.toUpperCase()}
                </p>
                <p>Payment: {order.paymentStatus}</p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>

              <p className="text-sm sm:text-[18px]">
                {currency}
                {order.totalAmount}
              </p>

              <select
                value={order.orderStatus}
                onChange={(e) => handleStatus(e, order._id)}
                className="p-2 font-semibold border"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Processing">Processing</option>
                <option value="Ready for Shipping">Ready for Shipping</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default Orders;
