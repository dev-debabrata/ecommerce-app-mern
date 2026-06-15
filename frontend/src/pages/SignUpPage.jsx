import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContext";

import Container from "../layout/Container";
import Button from "../components/Button";
import Input from "../components/Input";
import { useMutation } from "@tanstack/react-query";
import { loginUserApi, signupUser } from "../services/authService";

const SignUpPage = () => {
  const { togglePassword, isPasswordHidden, loginUser } = useAppContext();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isLoginOpen, setisLoginOpen] = useState(
    searchParams.get("mode") === "login",
  );

  const signupMutation = useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      loginUser(data.user);

      toast.success(data.message);
      setFormData({ name: "", email: "", password: "" });
      navigate("/");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Signup failed");
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginUserApi,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      loginUser(data.user);

      toast.success("Login successful!!");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Login failed");
    },
  });

  const inputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.warning("Please fill all fields");
      return;
    }

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!gmailRegex.test(formData.email)) {
      toast.warning("Only Gmail addresses are allowed");
      return;
    }

    signupMutation.mutate(formData);
  };

  const submitLoginForm = (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      toast.warning("Please fill all fields");
      return;
    }

    loginMutation.mutate({
      email,
      password,
    });
  };

  const placeholders = ["John Doe", "hello@gmail.com", "password"];
  const fieldNames = ["name", "email", "password"];

  return (
    <Container>
      {!isLoginOpen ? (
        <form
          onSubmit={submitForm}
          className="flex flex-col items-center gap-4 text-gray-800 mx-auto mt-14 w-[90%] sm:max-w-96"
        >
          <div className="mt-10 mb-2 flex items-center gap-2">
            <p className="text-3xl prata-regular">Sign Up</p>
            <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700"></p>
          </div>
          {placeholders.map((placeholder, index) => (
            <div key={fieldNames[index]} className="w-full relative">
              <Input
                htmlType={
                  placeholder === "password" && isPasswordHidden
                    ? "password"
                    : "text"
                }
                size="medium"
                placeholder={placeholder}
                name={fieldNames[index]}
                onChange={inputChange}
                value={formData[fieldNames[index]] || ""}
              />

              {placeholder === "password" && (
                <div>
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
              )}
            </div>
          ))}

          <div className="flex justify-between text-sm w-full">
            <Link to="/forgot-password">
              <p className="cursor-pointer hover:text-blue-600">
                Forgot your password?
              </p>
            </Link>
            <p
              className="cursor-pointer  hover:text-blue-600"
              onClick={() => setisLoginOpen(true)}
            >
              Login here
            </p>
          </div>
          <Button
            loading={signupMutation.isPending}
            disabled={signupMutation.isPending}
            type="primary"
            className="mt-4 font-light"
            buttonType="submit"
            size="small"
          >
            Sign Up
          </Button>
        </form>
      ) : (
        <form
          onSubmit={submitLoginForm}
          className="flex flex-col items-center gap-4 text-gray-800 mx-auto mt-14 w-[90%] sm:max-w-96"
        >
          <div className="mt-10 mb-2 flex items-center gap-2">
            <p className="text-3xl prata-regular cursor-pointer">Login</p>
            <p className="w-8 h-[1px] sm:h-[2px] bg-gray-700"></p>
          </div>

          {placeholders.slice(1).map((placeholder, index) => (
            <div key={fieldNames[index + 1]} className="w-full relative">
              <Input
                htmlType={
                  placeholder === "password" && isPasswordHidden
                    ? "password"
                    : "text"
                }
                size="medium"
                placeholder={placeholder}
                name={fieldNames[index + 1]}
                onChange={inputChange}
                value={formData[fieldNames[index + 1]] || ""}
              />

              {placeholder === "password" && (
                <div>
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
              )}
            </div>
          ))}

          <div className="flex justify-between text-sm w-full">
            <p className="cursor-pointer hover:text-blue-600">
              <Link to="/forgot-password">Forgot your password?</Link>
            </p>
            <p
              className="cursor-pointer  hover:text-blue-600"
              onClick={() => setisLoginOpen(false)}
            >
              Create a new account
            </p>
          </div>
          <Button
            loading={loginMutation.isPending}
            disabled={loginMutation.isPending}
            size="small"
            buttonType="submit"
            className="mt-4 font-light"
            type="primary"
          >
            Login
          </Button>
        </form>
      )}
    </Container>
  );
};

export default SignUpPage;
