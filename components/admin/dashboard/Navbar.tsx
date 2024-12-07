"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import { motion } from "framer-motion";
import styles from "@/app/css-modules/dashboard/navbar/dashboard.navbar.module.css";
import { usePathname } from "next/navigation";
import { CircleUserRound, Moon, Sun } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/public/logo.png";
import logoblack from "@/public/logo.png";
import { useTheme } from "next-themes";
import { IoCarSportOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TbMailQuestion,
  TbShoppingCartPlus,
  TbShoppingCartSearch,
  TbUserEdit,
} from "react-icons/tb";
import { BsShop } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";

export default function Navbar() {
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

  return (
    <nav
      style={{ zIndex: "1000000" }}
      className={`bg-white border-b z-50 border-gray-200 dark:bg-background dark:border-border ${styles.navCont}`}
    >
      <div className="mx-auto ">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href={"/admin/dashboard/stock"}
              onClick={() => {
                setIsOpen(false);
                setOpenDropdown("");
              }}
            >
              {/* <div className="hidden md:block">
                  {mounted && theme === "dark" && (
                    <Image className="w-36" src={logo} alt="Logo" />
                  )}
                  {mounted && theme === "light" && (
                    <Image className="w-36" src={logoblack} alt="Logo" />
                  )}
                </div>
                <div className="block md:hidden">
                  {theme === "dark" && (
                    <Image className="w-36" src={logo} alt="Logo" />
                  )}
                  {theme === "light" && (
                    <Image className="w-36" src={logoblack} alt="Logo" />
                  )}
                </div> */}
              <div className="">
                {theme === "dark" && (
                  <Image className="w-20" src={logo} alt="Logo" />
                )}
                {theme === "light" && (
                  <Image className="w-20" src={logoblack} alt="Logo" />
                )}
              </div>
              {/* <Image className="w-36" src={logo} alt="Logo" /> */}
            </Link>
          </div>
          <motion.div
            style={{ zIndex: "9999999" }}
            className="hidden md:flex"
            transition={{ duration: 0.5, ease: "circInOut" }}
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-center gap-3 w-fit ">
              <div className="hidden md:block w-fit h-fit">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="my-auto" variant="outline" size="icon">
                      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span className="sr-only">Toggle theme</span>
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
            </div>
          </motion.div>
          {/* {theme === "dark" && (
            <>
              <div className="md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md "
                >
                  <span className="sr-only">Open main menu</span>
                  {isOpen ? (
                    <RxCross2 size={28} color="white" />
                  ) : (
                    <RxHamburgerMenu
                      size={25}
                      color="white"
                      className="block w-6 h-6"
                    />
                  )}
                </button>
              </div>
            </>
          )}
          {theme === "light" && (
            <>
              <div className="md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md "
                >
                  <span className="sr-only">Open main menu</span>
                  {isOpen ? (
                    <RxCross2 size={28} color="black" />
                  ) : (
                    <RxHamburgerMenu
                      size={25}
                      color="black"
                      className="block w-6 h-6"
                    />
                  )}
                </button>
              </div>
            </>
          )} */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md "
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <RxCross2
                  size={28}
                  color={theme === "light" ? "black" : "white"}
                  className="dark:text-white text dark"
                />
              ) : (
                <RxHamburgerMenu
                  size={25}
                  color={theme === "light" ? "black" : "white"}
                  className="block w-6 h-6"
                />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      <div
        style={{ transform: "translateY(63px)", zIndex: "9999999" }}
        className={`fixed  inset-0 z-50 md:hidden transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black bg-opacity-65 "
          onClick={() => setIsOpen(false)}
        ></div>

        <div
          className={`absolute top-0 pt-2 right-0 w-64 h-full bg-white border-b border-gray-200 dark:bg-background dark:border-border bg-opacity-90 shadow-lg transform transition-transform duration-300 pb-4 ease-in-out flex flex-col justify-between ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ height: "calc(100vh - 62px)" }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/admin/dashboard/stock"
              className="flex items-center gap-1 px-3 py-3 text-sm font-medium transition-colors duration-300 rounded-md backgroundOrangHover"
              onClick={() => setIsOpen(false)}
            >
              <TbShoppingCartSearch />
              <span className="ml-3 ">Mis productos</span>
            </Link>
            <Link
              href="/admin/dashboard/stock/add"
              className="flex items-center gap-1 px-3 py-3 text-sm font-medium transition-colors duration-300 rounded-md backgroundOrangHover"
              onClick={() => setIsOpen(false)}
            >
              <TbShoppingCartPlus />
              <span className="ml-3 ">Agregar producto</span>
            </Link>

            <div
              className="flex items-center gap-1 px-3 py-3 text-sm font-medium transition-colors duration-300 rounded-md backgroundOrangHover"
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Cerrar sesión</span>
            </div>
            {/* 
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="my-auto" variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Modo claro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Modo oscuro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  Tema del sistema
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>

          <div className="w-full px-4 h-fit">
            <Select onValueChange={setTheme} value={theme}>
              <SelectTrigger id="framework">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <SelectValue placeholder="Tema" />
              </SelectTrigger>
              <SelectContent style={{ zIndex: "9999999" }} position="popper">
                <SelectItem value="light">Tema claro</SelectItem>
                <SelectItem value="dark">Tema oscuro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </nav>
  );
}
