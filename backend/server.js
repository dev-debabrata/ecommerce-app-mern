import "./config/loadEnv.js";
import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/product.route.js";
import adminRoutes from "./routes/admin.route.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const allowedOrigins = [process.env.CLIENT_URL, process.env.ADMIN_URL];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);



app.get("/", (req, res) => {
  res.send("ShopWear backend is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Server error:", error.message);
  }
};

startServer();
