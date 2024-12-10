import LoginForm from "@/components/admin/login/LoginForm";
import Image from "next/image";
import logo from "@/public/logo.png";
import React from "react";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "420 Constitución | Iniciar sesión"
};

const Login = () => {
  return (
    <>
      <div className="flex justify-center w-full h-fit">
        <Image alt="as" src={logo} className="mx-auto mt-6" width={100} />
      </div>
      <div
        style={{ height: "calc(100vh - 70px)" }}
        className="flex flex-col items-center justify-center w-full dark"
      >
        <div className="flex flex-col gap-8 w-fit h-fit dark">
          <span className="text-2xl font-normal text-left ">
            Iniciar sesión
          </span>
          <LoginForm />
        </div>
      </div>
    </>
  );
};

export default Login;
