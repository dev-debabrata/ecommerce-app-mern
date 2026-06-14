import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import { useCallback } from "react";

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

  // const fetchAllOrders = async () => {
  //   try {
  //     const res = await axios.get(
  //       backendUrl + "/api/orders/admin/all",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (res.data.success) {
  //       setOrders(res.data.orders);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Failed to load orders");
  //   }
  // };

  const handleStatus = async (e, orderId) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/orders/admin/status/${orderId}`,
        { orderStatus: e.target.value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

  // const handleStatus = async (e, orderId) => {
  //   try {
  //     const res = await axios.put(
  //       backendUrl + `/api/orders/admin/status/${orderId}`,
  //       {
  //         orderStatus: e.target.value,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (res.data.success) {
  //       fetchAllOrders();
  //       toast.success("Status updated");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Failed to update status");
  //   }
  // };

  // const handleStatus = async (e, orderId) => {
  //   try {
  //     const res = await axios.post(backendUrl + "/api/order/status", { orderId, status: e.target.value }, { headers: { token } });

  //     if (res.data.success) {
  //       await fetchAllOrders();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error.message);
  //   }
  // };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <main>
      <h1>Order page</h1>
      <div>
        {orders.map((order, i) => (
          <div key={i}
            className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700 '
          >
            <img className='w-12' src={assets.parcel_icon} alt='parcel icon' />
            <div>
              <div>
                {order.items.map((item, i) => {
                  if (i === order.items.length - 1) {
                    return (
                      <p className='py-0.5 text-orange-500' key={i}>
                        {item.name} x {item.quantity} <span>{item.size}</span>{" "}
                      </p>
                    );
                  } else {
                    return (
                      <p className='py-0.5 text-orange-500' key={i}>
                        {item.name} x {item.quantity} <span>{item.size}</span>,
                      </p>
                    );
                  }
                })}
              </div>
              <p className='mt-3 mb-2 font-medium'>
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div>
                <p>{order.address.street + ","} </p>
                <p>
                  {order.address.city +
                    ", " +
                    order.address.state +
                    ", " +
                    order.address.country +
                    ", " +
                    order.address.zipCode}
                </p>
              </div>
              <p>{order.address.mobile}</p>
            </div>
            <div>
              <p className='text-sm sm:text-[15px]'>Items: {order.items.length}</p>
              <p className='mt-3'>Method: {order.paymentMethod?.toUpperCase()}</p>
              <p>Payment: {order.paymentStatus}</p>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <p className='text-sm sm:text-[18px] '>{currency}{order.totalAmount}</p>


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

            {/* <select value={order.status}
              onChange={(e) => handleStatus(e, order._id)}
              className='p-2 font-semibold'
            >
              <option value='Order Placed'>Order Placed</option>
              <option value='Packing'>Packing</option>
              <option value='Shipped'>Shipped</option>
              <option value='Out for delivery'>Out for delivery</option>
              <option value='Delivered'>Delivered</option>
            </select> */}



          </div>
        ))}
      </div>
    </main>
  );
};

export default Orders;
