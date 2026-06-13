import express from "express";
import { createRazorpayOrder } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/razorpay/order", createRazorpayOrder);

export default router;