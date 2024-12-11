"use client";
import Navbar from "@/components/admin/dashboard/Navbar";
import { useSession } from "next-auth/react";
import { FaListCheck } from "react-icons/fa6";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import { motion } from "framer-motion";
import styles from "@/app/css-modules/dashboard/navbar/dashboard.navbar.module.css";
import { usePathname, useRouter } from "next/navigation";
import { CircleUserRound, Moon, Sun } from "lucide-react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/public/logo.png";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TbShoppingCartPlus,
  TbShoppingCartSearch,
} from "react-icons/tb";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  useEffect(() => {
    // indica componente montado
    setMounted(true);
  }, []);




  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("");
  const [navbarBg, setNavbarBg] = useState("bg-transparent");
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false); // Agregamos un estado para saber si el componente ya está montado

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? "" : dropdown);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    if (!isOpen) {
      setOpenDropdown("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const { data: session }: any = useSession();
  const router = useRouter();
  console.log(pathname)
  useEffect(() => {
    if (pathname !== "/") {
      return setNavbarBg("bg-black");
    }
    const handleScroll = () => {
      console.log(pathname);
      if (pathname !== "/") {
        return setNavbarBg("bg-black");
      }
      if (window.scrollY >= window.innerHeight) {
        setNavbarBg("bg-black");
      } else {
        setNavbarBg("bg-transparent");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const { setTheme } = useTheme();
  const { theme } = useTheme();

  // hydration bug fix on logos
  useEffect(() => {
    setMounted(true);
  }, []);


  // si no está montado, renderiza div vacío para evitar error de hidratación
  if (!mounted) {
    return <div />;
  }

  return (
    <>
      <Navbar />
      <div className="flex pt-16 overflow-hidden bg-white lg:pt-0 ">
        <aside
          id="sidebar"
          className="fixed top-0 left-0 z-20 flex-col flex-shrink-0 hidden w-56 h-full pt-0 duration-75 lg:flex transition-width"
          aria-label="Sidebar"
        >
          <div className="relative flex flex-col flex-1 min-h-0 pt-0 bg-white border-gray-200 borderR dark:bg-background">

            <div className="flex items-center justify-center w-full py-6 border-bottom">
              <Image className="w-20" src={logo} alt="Logo" />
              {/* <Separator orientation="vertical" className="hidden mx-4 lg:block" style={{ width: '1px', height: '40px' }} />
              <span className="hidden text-sm font-semibold lg:block">Panel de administración</span> */}
            </div>


            <Separator style={{ margin: ' 0' }} className="" />

            <div className="flex flex-col flex-1 pt-2 pb-4 overflow-y-auto">
              <div className="flex-1 px-3 space-y-1 bg-white divide-y dark:bg-background">
                <ul className="pb-2 mt-1 space-y-1">
                  <span className="ml-2 text-xs font-semibold text-gray-400">Productos</span>
                  <li>
                    <Link
                      href={"/admin/dashboard/stock"}
                      className={`${pathname === '/admin/dashboard/stock' ? 'dark:bg-white dark:text-black bg-black text-white' : 'text-black dark:bg-background dark:text-white'} flex items-center p-2 text-base font-normal  rounded-lg hover:text-white dark:hover:text-black hover:bg-black dark:hover:bg-gray-100  group`}
                    >
                      <TbShoppingCartSearch size={19} />
                      <span className="ml-2 text-sm">Todos los productos</span>
                    </Link>
                  </li>

                  <Separator style={{ margin: '10px 0 10px 0' }} className="h-0" />

                  <span className="ml-2 text-xs font-semibold text-gray-400 ">Esquejes</span>
                  <li>
                    <Link
                      href={"/admin/dashboard/stock"}
                      className="flex items-center p-2 text-base font-normal text-black rounded-lg hover:text-white dark:text-white dark:hover:text-black hover:bg-black dark:hover:bg-gray-100 dark:bg-background group"
                    >
                      <FaListCheck size={16} />
                      <span className="ml-3 text-sm">Mis pedidos</span>
                    </Link>
                  </li>
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

            {/* theme and user menus */}
            <div
              style={{ zIndex: "9999999" }}
              className="hidden mx-3 my-4 md:flex"
            >
              <div className="flex items-center justify-center w-full gap-3 ">
                <div className="flex items-center w-full gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      {/* User Avatar */}
                      <CircleUserRound size={30} strokeWidth={1} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      style={{ zIndex: "9999999999" }}
                      className="w-52"
                    >
                      <DropdownMenuLabel>
                        {session?.user?.name} {session?.user?.surname}{" "}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          signOut();
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        <span>Cerrar sesión</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <span className="text-xs">{session?.user?.name} {session?.user?.surname}</span>
                </div>

                <div className="hidden md:block w-fit h-fit">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button style={{ width: '30px', height: '30px' }} className="my-auto" variant="outline" size="icon">
                        <Sun className="h-[0.9rem] w-[0.9rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[0.9rem] w-[0.9rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      style={{ zIndex: "9999999999" }}
                      align="end"
                    >
                      <DropdownMenuItem onClick={() => setTheme("light")}>
                        Modo claro
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("dark")}>
                        Modo oscuro
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

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
          className="relative w-full min-h-screen overflow-x-hidden overflow-y-hidden bg-white border-l-0 lg:border-l border-gray-200 dark:bg-background dark:border-border lg:ml-56"
        >
          <main>
            <div className="p-5 sm:p-7 2xl:px-9 2xl:py-7">
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
