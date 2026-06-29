  import SigninImg from "../../../public/assets/Login.png";
  import { Button, Field, Input, Label } from "@headlessui/react";
  import { LuEye, LuEyeClosed } from "react-icons/lu";
  import { useState } from "react";
  import { Form, Link, useNavigate } from "react-router-dom";
  import { Toaster } from "react-hot-toast";
  import toast from "react-hot-toast";
  import React from "react";
  import { useDispatch } from "react-redux";
  import { signupSuccess } from "../../state-management/authSlice";

  export default function Signin() {
    const navigate = useNavigate();
    const [eyeIcon, setEyeIcon] = useState(false);
    const [confirmeyeIcon, setConfirmEyeIcon] = useState(false);

    const [formData, setFormData] = useState({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    });
    const [error, setError] = useState({});
    const dispatch = useDispatch();
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validForm = () => {
      const errors = {};
      if (formData.fullName.trim()==='') {
        errors.fullName = "Name should not be Empty";
      }
      if (!formData.email || !formData.email.includes("@")) {
        errors.email = "Email must include @";
      }
      if (!formData.password || formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
      if (formData.password != formData.confirmPassword) {
        errors.confirmPassword = "Password does not match";
      }

      setError(errors);
      return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validForm()) return;
      const newUsers = {
        username: e.target.fullName.value,
        email: e.target.email.value,
        password: e.target.password.value,
        confirmPassword: e.target.confirmPassword.value,
        role: e.target.role.value,
      };
      const res = await fetch("https://libraray-management-4ikn.onrender.com/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUsers),
      });

      if (res.ok) {
        const savedUser = await res.json();

        dispatch(signupSuccess(savedUser));

        toast.success("Account created successfully!");
        setTimeout(() => {
          navigate("/homepage");
        }, 1500);
      }
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
        <div className="flex justify-center items-center  min-h-[70vh] shadow-xl mt-10 w-[90vw] max-w-5xl m-auto bg-white rounded-xl overflow-hidden">
          <div className="hidden md:block md:w-1/2">
            <img
              src={SigninImg}
              alt="signin"
              className="h-full w-full object-cover rounded-bl-xl rounded-tl-xl"
            />
          </div>

          <div className="w-full md:w-1/2 p-8">
            <div className="max-w-md mx-auto">
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-semibold text-slate-800">
                  Create account
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Register to access the library management system.
                </p>
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
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Enter Your Email"
                    className="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  {error.email && (
                    <p className="mt-1 text-sm text-red-600">{error.email}</p>
                  )}
                </Field>

                <Field>
                  <Label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Password
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      type={eyeIcon ? "text" : "password"}
                      placeholder="Create a password"
                      className="block w-full rounded-lg border border-slate-200 bg-white pr-10 px-3 py-2 text-sm leading-6 text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    {error.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {error.password}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={eicon}
                      aria-label="Toggle password visibility"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    >
                      {eyeIcon ? <LuEye /> : <LuEyeClosed />}
                    </button>
                  </div>
                </Field>

                <Field>
                  <Label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Confirm password
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      type={confirmeyeIcon ? "text" : "password"}
                      placeholder="Re-enter password"
                      className="block w-full rounded-lg border border-slate-200 bg-white pr-10 px-3 py-2 text-sm leading-6 text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    {error.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {error.confirmPassword}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => setConfirmEyeIcon((prev) => !prev)}
                      aria-label="Toggle password visibility"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    >
                      {confirmeyeIcon ? <LuEye /> : <LuEyeClosed />}
                    </button>
                  </div>
                </Field>

                <Field>
                  <Label
                    htmlFor="role"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Role
                  </Label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="admin">Admin</option>
                    <option value="librarian">Librarian</option>
                    <option value="guest">Guest</option>
                  </select>
                </Field>

                <Button
                  type="submit"
                  className="w-full mt-1 inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  Sign up
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-slate-500">
                Already have an account?
                <Link to={"/"} className="text-indigo-600 hover:underline">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
