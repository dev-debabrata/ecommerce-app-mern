import { axiosInstance } from "../utils/axios";

export const createRazorpayOrder = async (amount) => {
    const res = await axiosInstance.post("/payment/razorpay/order", {
        amount,
    });

    return res.data;
};