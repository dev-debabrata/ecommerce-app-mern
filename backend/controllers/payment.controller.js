import Razorpay from "razorpay";

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const order = await razorpayInstance.orders.create({
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        });

        res.json({
            success: true,
            key: process.env.RAZORPAY_KEY_ID,
            order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Razorpay order creation failed",
        });
    }
};