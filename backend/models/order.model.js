import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: [
            {
                productId: String,
                name: String,
                price: Number,
                quantity: Number,
                size: String,
                image: String,
            },
        ],

        address: {
            firstName: String,
            lastName: String,
            emailAddress: String,
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String,
            mobile: String,
        },

        paymentMethod: {
            type: String,
            enum: ["cod", "razorpay", "stripe"],
            default: "cod",
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid"],
            default: "pending",
        },

        orderStatus: {
            type: String,
            default: "Ready for Shipping",
        },

        subTotal: Number,
        shippingFee: Number,
        totalAmount: Number,
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;