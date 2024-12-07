"use client";
import React, { useEffect, useState } from "react";
import styles from "@/app/css-modules/home.search.module.css";
import { motion } from "framer-motion";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import searchimg from "@/public/search6.png";
import Image from "next/image";
const Search = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const searchParams = useSearchParams();
  const { push } = useRouter();
  console.log(searchParams.get("search"));

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
    console.log(searchValue);
  }, [searchValue]);

  return (
    <>
      <div
        className={`${styles.cont} z-0 flex flex-col items-center justify-center w-full gap-0 px-5 py-36 sm:py-28 md:py-48 sm:px-0 h-fit`}
      >
        <div className="flex gap-5 lg:gap-6">
          <motion.div
            initial={{ opacity: 0, scale: .8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ amount: "some", once: true }}
            transition={{ duration: 0.7, ease: "easeInOut", delay: 0.3 }}
            className="z-50 flex flex-col gap-2 px-2 my-auto overflow-hidden w-fit h-hit"
          >
            <Image src={searchimg} alt="" className="hidden sm:block" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -70 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: "some", once: true }}
            transition={{ duration: 0.7, ease: "easeInOut", delay: 0.3 }}
            className="z-50 flex flex-col gap-2 px-2 my-auto overflow-hidden w-fit h-hit"
          >
            <span className="text-base font-semibold text-red-500 ">
              Buscar unidad
            </span>
            <h4 className="mb-2 text-2xl font-bold leading-6 lg:text-3xl 2xl:text-4xl ">
              Encontrá el vehículo que estás buscando
            </h4>
            <span className="text-xs text-left text-gray-500 sm:text-sm md:text-lg">
              Tenemos unidades usadas y 0 km para todos los gustos y necesidades
            </span>
          </motion.div>
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ amount: "some", once: true }}
            transition={{ duration: 0.7, ease: "easeInOut", delay: 0.5 }}
            className="w-full px-3 py-5 overflow-hidden px-auto md:w-fit h-hit"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className={`${styles.form} mx-auto `}
            >
              <button type="button" disabled>
                <svg
                  width="17"
                  height="16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-labelledby="search"
                >
                  <path
                    d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                    stroke="currentColor"
                    stroke-width="1.333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </button>
              <input
                onChange={(e) => setSearchValue(e.target.value)}
                className={`${styles.input}`}
                placeholder="Ingresa una marca o modelo..."
                type="text"
              />
              <button
                className={`${styles.reset}`}
                onClick={() => setSearchValue("")}
                type="reset"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </form>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 70 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: "some", once: true }}
            transition={{ duration: 0.7, ease: "easeInOut", delay: 0.8 }}
            className="mt-3 overflow-hidden w-fit h-hit"
          >
            <button onClick={handleSearch} className={styles.button}>
              Buscar
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Search;
