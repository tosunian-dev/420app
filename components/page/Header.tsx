"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BsChevronDown } from "react-icons/bs";
import Image from "next/image";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import logo from "@/public/dalogo.png";
import { motion } from "framer-motion";
import styles from "@/app/css-modules/home.header.module.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("");
  const [navbarBg, setNavbarBg] = useState("bg-transparent");
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState<string>("");
  const searchParams = useSearchParams();
  const { push } = useRouter();

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? "" : dropdown);
  };

  const handleSearch = () => {
    console.log(searchValue);
    const params = new URLSearchParams(searchParams);
    if (searchValue !== "") {
      params.set("search", searchValue);
    } else {
      params.delete("search");
    }
    push(`/vehicles/?${params.toString()}`);
    console.log(params.toString());
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

  useEffect(() => {
    if (pathname !== "/") {
      return setNavbarBg("bg-black");
    }
    const handleScroll = () => {
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

  useEffect(() => {
    console.log(searchValue);
  }, [searchValue]);

  return (
    <nav
      style={{ zIndex: "1000000" }}
      className={`text-white fixed w-full transition-colors duration-300 ${navbarBg} ${styles.navCont}`}
    >
      <div className="mx-auto max-w-8xl ">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <motion.div
              style={{ zIndex: "99999999" }}
              className="flex-shrink-0"
              transition={{ duration: 0.5, ease: "circInOut", delay: 0.2 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Link
                href={"/"}
                onClick={() => {
                  setIsOpen(false);
                  setOpenDropdown("");
                }}
              >
                <Image
                  className="hidden md:block"
                  style={{ width: "170px" }}
                  src={logo}
                  alt="SacaTurno"
                />
                <Image
                  className="block w-36 md:hidden"
                  src={logo}
                  alt="SacaTurno"
                />
              </Link>
            </motion.div>
          </div>
          <div className="flex items-center">
            <motion.div
              style={{ zIndex: "9999999" }}
              className="items-center hidden md:gap-12 xl:gap-14 md:flex"
              transition={{ duration: 0.5, ease: "circInOut" }}
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-baseline ml-10 space-x-5">
                <Link
                  href="/vehicles"
                  style={{ fontSize: "11px" }}
                  onClick={() => {
                    setOpenDropdown("");
                  }}
                  className="px-3 py-2 text-xs font-semibold uppercase transition-colors duration-300 rounded-md "
                >
                  Nuestros vehículos
                </Link>
                <Link
                  href="/contactus"
                  style={{ fontSize: "11px" }}
                  className="px-3 py-2 text-xs font-semibold uppercase transition-colors duration-300 rounded-md "
                  onClick={() => {
                    setOpenDropdown("");
                  }}
                >
                  Sobre nosotros
                </Link>
                <Link
                  href="/contactus"
                  style={{ fontSize: "11px" }}
                  className="px-3 py-2 text-xs font-semibold uppercase transition-colors duration-300 rounded-md "
                  onClick={() => {
                    setOpenDropdown("");
                  }}
                >
                  Contactanos
                </Link>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
                className="max-w-lg mx-auto"
              >
                <div className="flex">
                  <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
                    Your Email
                  </label>

                  <div className="relative w-full">
                    <input
                      type="text"
                      onChange={(e) => setSearchValue(e.target.value)}
                      id="search-dropdown"
                      className="z-20 block w-full px-2 py-1.5 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 border-s-gray-50 border-s-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-red-500"
                      placeholder="Buscar un vehículo "
                    />
                    <button
                      type="submit"
                      onClick={handleSearch}
                      className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-red-700 rounded-e-lg border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                    >
                      <svg
                        className="w-2.5 h-2.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md "
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <RxCross2
                    size={28}
                    style={{ zIndex: "99999999" }}
                    color="white"
                  />
                ) : (
                  <RxHamburgerMenu
                    size={25}
                    color="white"
                    style={{ zIndex: "99999999" }}
                    className="block w-6 h-6"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        style={{ zIndex: "9999999" }}
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black bg-opacity-65 "
          onClick={() => setIsOpen(false)}
        ></div>
        <div
          style={{ width: "210px" }}
          className={`absolute top-0 pt-2 right-0  h-full bg-black bg-opacity-90 shadow-lg transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="px-2 pt-2 pb-3 mt-16 space-y-2 sm:px-3">
            <Link
              href="/vehicles"
              className="flex items-center gap-2 px-3 py-3 text-sm font-medium transition-colors duration-300 rounded-md backgroundOrangHover"
              onClick={() => setIsOpen(false)}
            >
              Nuestros vehículos
            </Link>
            <Link
              href="/contactus"
              className="flex items-center gap-2 px-3 py-3 text-sm font-medium transition-colors duration-300 rounded-md backgroundOrangHover"
              onClick={() => setIsOpen(false)}
            >
              Sobre nosotros
            </Link>
            <Link
              href="/contactus"
              className="flex items-center gap-2 px-3 py-3 text-sm font-medium transition-colors duration-300 rounded-md backgroundOrangHover"
              onClick={() => setIsOpen(false)}
            >
              Contactanos
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
