import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useAppContext } from "../context/AppContext";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../services/authService";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const { isPasswordHidden, togglePassword } = useAppContext();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      setMessage(data.message);

      setTimeout(() => {
        navigate("/signup?mode=login");
      }, 2000);
    },
    onError: (error) => {
      setMessage(error?.response?.data?.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("Invalid reset link. No token provided.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    resetPasswordMutation.mutate({
      resetToken: token,
      newPassword: password,
    });
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-gray-100 rounded">
      <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type={isPasswordHidden ? "password" : "text"}
            placeholder="New password"
            className="border p-2 w-full mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <img
            onClick={togglePassword}
            src="/images/eye.png"
            className="absolute top-2.5 right-2 cursor-pointer z-20"
            alt="hide-password-icon"
          />
          {isPasswordHidden && (
            <p className="text-3xl absolute top-1 right-3.5">/</p>
          )}
        </div>
        <div className="relative w-full">
          <input
            type={isPasswordHidden ? "password" : "text"}
            placeholder="Confirm password"
            className="border p-2 w-full mb-4"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <img
            onClick={togglePassword}
            src="/images/eye.png"
            className="absolute top-2.5 right-2 cursor-pointer z-20"
            alt="hide-password-icon"
          />
          {isPasswordHidden && (
            <p className="text-3xl absolute top-1 right-3.5">/</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 w-full cursor-pointer"
        >
          Reset Password
        </button>
      </form>
      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
};

export default ResetPassword;
