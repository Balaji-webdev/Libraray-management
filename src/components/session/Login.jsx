
import LoginForm from "./loginForm";
import loginImgs from "../../../public/assets/10241279.jpg"
import React from "react";   

export default function Login() {
  return (
    <>
      <div className="flex justify-center items-center h-[70vh] shadow-xl mt-20 w-[72vw] m-auto bg-white rounded-xl overflow-hidden">
        <div className="hidden md:block w-1/2">
          <img
            src={loginImgs}
            alt="login"
            className="h-full w-full object-cover rounded-bl-xl rounded-tl-xl"
          />
        </div>

        <div className="w-full md:w-1/2 p-8">
         <LoginForm/>
        </div>
      </div>
    </>
  );
}
