import { Button, Field, Input, Label } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useEffect } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../state-management/authSlice";
export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [eyeIcon, setEyeIcon] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validForm = () => {
    const errors = {};
    if (!formData.email || !formData.email.includes("@")) {
      errors.email = "Email must include @";
    }
    if (!formData.password || formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    console.log(errors)
    setError(errors); 
    return Object.keys(errors).length === 0;
  };

  // useEffect(() => {
  //   if (user) {
  //     toast.success("Login successful — redirecting...");
  //     const from = location.state?.from || "/homepage";
  //     navigate(from);
  //   }

  // }, [user, errors, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validForm()) return;

    try {
      const result = await dispatch(loginUser(formData)).unwrap();
      if (result) {
        toast.success('Login Successfully Redirecting ....')
        setTimeout(() => {
          navigate("/homepage/Book");
        }, 1000);
      }
    } catch (err) {
      toast.error(err || "Login failed");
    }
    setFormData({ email: "", password: "" });
  };

  const eicon = () => {
    setEyeIcon((prev) => !prev);
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "bg-white text-slate-800 border border-slate-200 rounded-xl shadow-lg px-6 py-4 text-base ",
          style: {
            fontSize: "1rem",
            height: "80px",
            width: "300px",
          },
        }}
      />

      <div className="p-8">
        <div className="mb-6 text-center">
          <h1 className="mt-4 text-2xl font-semibold text-slate-800">Welcome to Libra</h1>
          <p className="mt-1 text-sm text-slate-500">Access your digital library — anytime, anywhere</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Field>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email
            </Label>
            <Input
              value={formData.email}
              onChange={handleChange}
              id="email"
              name="email"
              type="email"
              placeholder="Enter your Email"
              className="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {error.email && (
              <p className="mt-1 text-sm text-red-600">{error.email}</p>
            )}
          </Field>

          <Field>
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Password
              </Label>

            </div>

            <div className="relative mt-2">
              <Input
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                type={eyeIcon ? "text" : "password"}
                placeholder="Enter your password"
                className="block w-full rounded-lg border border-slate-200 bg-white pr-10 px-3 py-2 text-sm leading-6 text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="button"
                onClick={eicon}
                aria-label="Toggle password visibility"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {eyeIcon ? <LuEye /> : <LuEyeClosed />}
              </button>
            </div>

            {error.password && (
              <p className="mt-1 text-sm text-red-600">{error.password}</p>
            )}
          </Field>

          <Button
            type="submit"
            className="w-full mt-1 inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?
          <Link to="/Signin" className="text-indigo-600 hover:underline ml-1">
            sign up
          </Link>
        </div>
      </div>
    </>
  );
}
