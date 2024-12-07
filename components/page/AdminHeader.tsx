"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BsChevronDown } from "react-icons/bs";
import Image from "next/image";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import logo from "@/public/logo.png";
import { motion } from "framer-motion";

export default function AdminHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("");
  const [navbarBg, setNavbarBg] = useState("bg-transparent");

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= window.innerHeight) {
        setNavbarBg("bg-black");
      } else {
        setNavbarBg("bg-transparent   ");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      style={{ zIndex: "1000000" }}
      className={`text-white fixed w-full transition-colors duration-300 ${navbarBg}`}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8 lg:px-14">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <motion.div className="flex-shrink-0" transition={{duration:0.5, ease:'circInOut', delay: 0.2 }}
            initial={{ opacity: 0}}
            animate={{ opacity: 1 }}>
              <Link
                href={"/admin/dashboard"}
                onClick={() => {
                  setIsOpen(false);
                  setOpenDropdown("");
                }}
              >
                <Image className="w-36" src={logo} alt="SacaTurno" />
              </Link>
            </motion.div>
          </div>
          <motion.div
            style={{ zIndex: "9999999" }}
            className="hidden md:block"
            transition={{duration:0.5, ease:'circInOut'}}
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-baseline ml-10 space-x-4">
              <Link
                href="/public/search"
                onClick={() => {
                  setOpenDropdown("");
                }}
                className="px-3 py-2 text-xs font-normal uppercase transition-colors duration-300 rounded-md backgroundOrangHover"
              >
                Vehículos
              </Link>
              <Link
                href="/admin/profile"
                className="px-3 py-2 text-xs font-normal uppercase transition-colors duration-300 rounded-md backgroundOrangHover"
                onClick={() => {
                  setOpenDropdown("");
                }}
              >
                Nosotros
              </Link>
              <Link
                href="/admin/profile"
                className="px-3 py-2 text-xs font-normal uppercase transition-colors duration-300 rounded-md backgroundOrangHover"
                onClick={() => {
                  setOpenDropdown("");
                }}
              >
                Contacto
              </Link>
            </div>
          </motion.div>
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
        </div>
      </div>
      {/* Mobile menu */}
      <div
        style={{ transform: "translateY(63px)", zIndex: "9999999" }}
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black bg-opacity-65 "
          onClick={() => setIsOpen(false)}
        ></div>
        <div
          className={`absolute top-0 pt-2 right-0 w-64 h-full bg-black bg-opacity-90 shadow-lg transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/public/search"
              className="flex items-center gap-2 px-3 py-3 text-sm font-medium uppercase transition-colors duration-300 rounded-md backgroundOrangHover"
              onClick={() => setIsOpen(false)}
            >
              Vehículos
            </Link>
            <Link
              href="/admin/profile"
              className="flex items-center gap-2 px-3 py-3 text-sm font-medium uppercase transition-colors duration-300 rounded-md backgroundOrangHover"
              onClick={() => setIsOpen(false)}
            >
              Nosotros
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
