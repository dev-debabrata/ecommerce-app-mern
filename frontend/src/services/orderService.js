import { axiosInstance } from "../utils/axios";

export const createOrder = async (orderData) => {
    const res = await axiosInstance.post("/orders", orderData);
    return res.data;
};

export const getMyOrders = async () => {
    const res = await axiosInstance.get("/orders/my-orders");
    return res.data;
};

