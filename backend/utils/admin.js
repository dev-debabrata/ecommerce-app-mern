import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import Admin from "../models/admin.model.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await Admin.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
    });

    console.log("Admin created successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();
