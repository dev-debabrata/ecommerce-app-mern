import Order from "../models/order.model.js";

export const createOrder = async (req, res) => {
    try {
        const {
            items,
            address,
            paymentMethod,
            paymentStatus,
            subTotal,
            shippingFee,
            totalAmount,
        } = req.body;

        const order = await Order.create({
            userId: req.user._id,
            items,
            address,
            paymentMethod,
            paymentStatus,
            subTotal,
            shippingFee,
            totalAmount,
        });

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Order create failed",
        });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort({
            createdAt: -1,
        });

        res.json({
            success: true,
            orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get orders",
        });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("userId", "name email")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get all orders",
        });
    }
};