import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Container from "../layout/Container";
import Button from "../components/Button";
import Input from "../components/Input";

import { forgotPassword } from "../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      setMessage(data.message);
      toast.success("Reset link has been sent to your email");

      setTimeout(() => {
        navigate("/signup?mode=login");
      }, 2000);
    },
    onError: (error) => {
      setMessage(error?.response?.data?.message || "Something went wrong");
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  const submitForm = (e) => {
    e.preventDefault();

    if (!email) {
      toast.warning("Please enter your email");
      return;
    }

    forgotPasswordMutation.mutate(email);
  };


  return (
    <Container>
      <div className="py-17">
        <form
          onSubmit={submitForm}
          className="flex flex-col rounded-lg py-7.5 px-4 mb-12 gap-4 max-w-120 mx-auto border"
        >
          <h1 className="text-4xl font-medium text-center mb-6">
            Recover Password
          </h1>
          <label className="text-center font-bold" htmlFor="">
            Email address
          </label>
          <Input
            htmlType="email"
            placeholder="Enter email"
            size="large"
            onChange={(e) => setEmail(e.target.value)}
            inputClassName="py-2 px-4 placeholder:text-amber-300"
            required
          />

          <div className="flex justify-center">
            <Button
              loading={forgotPasswordMutation.isPending}
              disabled={forgotPasswordMutation.isPending}
              type="primary"
              className=" font-light"
              buttonType="submit"
              size="small"
            >
              {forgotPasswordMutation.isPending ? "Sending..." : "SEND"}
            </Button>
          </div>

          {/* <Button loading={isLoading} buttonType="submit" size="large">
            {isLoading ? "Sending..." : "SEND"}
          </Button> */}
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}
      </div>
    </Container>
  );
};

export default ForgotPassword;
