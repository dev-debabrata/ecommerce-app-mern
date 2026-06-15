import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { sendResetPasswordMail } from "../utils/sendMail.js";

const generateToken = (userId, expiresIn = "7d") => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn });
};

export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Only Gmail addresses are allowed" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(403).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const logoutUser = async (req, res) => {
  res.status(200).json({
    message: "Logout successful",
  });
};

export const getProfile = async (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "No user with that email" });
    }

    const resetToken = generateToken(user._id, "1h");

    user.resetToken = await bcrypt.hash(resetToken, 10);
    await user.save();

    const resetLink = `${process.env.CLIENT_URL || "http://localhost:5173"
      }/reset-password/${resetToken}`;

    await sendResetPasswordMail(user.email, resetLink);

    res.status(200).json({
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        message: "Reset token and password are required",
      });
    }

    const verifiedToken = jwt.verify(resetToken, process.env.JWT_SECRET);

    const user = await User.findById(verifiedToken.id);

    if (!user || !user.resetToken) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const isTokenMatched = await bcrypt.compare(resetToken, user.resetToken);

    if (!isTokenMatched) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;

    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid or expired token",
    });
  }
};
