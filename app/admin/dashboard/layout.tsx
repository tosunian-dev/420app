"use client";
import Link from "next/link";
import {
  TbShoppingCartSearch,
} from "react-icons/tb";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/admin/dashboard/Navbar";
import { useSession } from "next-auth/react";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // indica componente montado
    setMounted(true);
  }, []);

  const { data: session }: any = useSession();

  // si no está montado, renderiza div vacío para evitar error de hidratación
  if (!mounted) {
    return <div />;
  }
  return (
    <>
      {/* <Nav /> */}
      <Navbar />
      <div className="flex pt-16 overflow-hidden bg-white ">
        <aside
          id="sidebar"
          className="fixed top-0 left-0 z-20 flex-col flex-shrink-0 hidden w-64 h-full pt-16 duration-75 lg:flex transition-width"
          aria-label="Sidebar"
        >
          <div className="relative flex flex-col flex-1 min-h-0 pt-0 bg-white border-gray-200 borderR dark:bg-background">
            <div className="flex flex-col flex-1 pt-2 pb-4 overflow-y-auto">
              <div className="flex-1 px-3 space-y-1 bg-white divide-y dark:bg-background">
                <ul className="pb-2 space-y-1">
                  <li>
                    <Link
                      href={"/admin/dashboard/stock"}
                      className="flex items-center p-2 text-base font-normal text-black rounded-lg hover:text-white dark:text-white dark:hover:text-black hover:bg-black dark:hover:bg-gray-100 dark:bg-background group"
                    >
                      <TbShoppingCartSearch size={20} />
                      <span className="ml-3 ">Mis productos</span>
                    </Link>
                  </li>
                  <Separator className="" />
                  {/* 
                  <li>
                    <Link
                      href={"/admin/dashboard/stock/add"}
                      className="flex items-center p-2 text-base font-normal text-black rounded-lg hover:text-white dark:text-white dark:hover:text-black hover:bg-black dark:hover:bg-gray-100 dark:bg-background group"
                    >
                      <TbShoppingCartPlus size={20} />
                      <span className="ml-3 ">Agregar producto</span>
                    </Link>
                  </li> */}
                </ul>
              </div>
            </div>
          </div>
        </aside>
        <div
          className="fixed inset-0 z-10 hidden bg-gray-900 opacity-50"
          id="sidebarBackdrop"
        ></div>
        <div
          id="main-content"
          className="relative w-full h-full overflow-x-hidden overflow-y-hidden bg-white border-l border-gray-200 dark:bg-background dark:border-border lg:ml-64"
        >
          <main>
            <div className="p-6 sm:p-10">
              <div className="w-full min-h-[calc(100vh-230px)]">
                <div className="bg-white dark:bg-background">
                  {children}
                </div>
              </div>
            </div>
          </main>

          <p className="my-10 text-sm font-thin text-center text-white opacity-30">
            Desarrollado por tosunian.dev
          </p>
        </div>
      </div>
    </>
  );
}
