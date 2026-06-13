import express from "express";
import {
    createOrder,
    getMyOrders,
    getAllOrders,
} from "../controllers/order.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createOrder);
router.get("/my-orders", protectRoute, getMyOrders);
router.get("/admin/all", protectRoute, getAllOrders);

export default router;