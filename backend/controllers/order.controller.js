import Order from "../models/order.model.js";

export const createOrder = async (req, res) => {
    try {
        const {
            items,
            address,
            paymentMethod,
            paymentStatus,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            subTotal,
            shippingFee,
            totalAmount,
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order items are required",
            });
        }

        const order = await Order.create({
            userId: req.user._id,
            items,
            address,
            paymentMethod,
            paymentStatus,

            razorpayPaymentId: razorpayPaymentId || "",
            razorpayOrderId: razorpayOrderId || "",
            razorpaySignature: razorpaySignature || "",

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
        console.log("Order create error:", error);

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
        console.log("Get my orders error:", error);

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
        console.log("Get all orders error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get all orders",
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus },
            { returnDocument: "after" }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.json({
            success: true,
            message: "Order status updated",
            order,
        });
    } catch (error) {
        console.log("Update order status error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update order status",
        });
    }
};