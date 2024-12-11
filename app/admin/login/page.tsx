import LoginForm from "@/components/admin/login/LoginForm";
import Image from "next/image";
import logo from "@/public/logo.png";
import React from "react";
import { Metadata } from "next";
import { Card } from "@/components/ui/card";
export const metadata: Metadata = {
  title: "420 Constitución | Iniciar sesión"
};

const Login = () => {
  return (
    <>
      <div className="">
        <div className="flex justify-center w-full h-fit">
          <Image alt="as" src={logo} className="mx-auto mt-6" width={100} />
        </div>
        <div
          style={{ height: "calc(100vh - 70px)" }}
          className="flex flex-col items-center justify-center w-full dark"
        >
          <Card className="flex flex-col justify-between gap-8 mx-5 bg-transparent pt-7 pl-7 pr-7 w-fit h-fit dark backdrop-blur-sm">
            <div className="flex flex-col gap-2">
              <span className="text-2xl font-semibold text-left ">
                Iniciar sesión
              </span>
              <span className="text-sm font-normal text-left ">
                ¡Bienvenido! Ingresá tu usuario y contraseña para acceder.
              </span>

            </div>
            <LoginForm />
          </Card>
        </div>
      </div >
    </>
  );
};

export default Login;
