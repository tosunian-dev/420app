"use client";
import React from "react";
import styles from "@/app/css-modules/home.section2.module.css";
import { SiCashapp } from "react-icons/si";
import { FaCar } from "react-icons/fa";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { motion, useViewportScroll, useTransform } from "framer-motion";
import Reveal from "./Reveal";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
const Section2 = () => {
  const { scrollYProgress } = useViewportScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [0.2, 2]);

  return (
    <>
      <section className="relative">
        <div className="relative flex items-center content-center justify-center pt-20 pb-36 md:pt-36 md:pb-44 2xl:pt-38 2xl:pb-52 min-h-screen-100 ">
          <div className={`absolute top-0 w-full h-full ${styles.bgSection}`}>
            <span
              id="blackOverlay"
              className="absolute w-full h-full bg-black opacity-20"
            ></span>
          </div>
          <div className="container relative mx-auto">
            <div className="flex flex-wrap items-center">
              <div className="w-full px-4 ml-auto mr-auto text-center lg:w-10/12">
                <div className="flex flex-col gap-7">
                  <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ amount: "some", once: true }}
                    transition={{
                      duration: 0.7,
                      ease: "circInOut",
                      delay: 0.2,
                    }}
                  >
                    <h1 className="text-3xl font-semibold text-left md:text-center text-white sm:text-4xl">
                      ¿Por qué comprar tu auto en Distrito Automotor?
                    </h1>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ amount: "some", once: true }}
                    transition={{
                      duration: 0.7,
                      ease: "circInOut",
                      delay: 0.5,
                    }}
                  >
                    <p className="mt-8 text-base text-left md:text-center font-normal text-white sm:text-lg">
                      Tenemos las mejores unidades seleccionadas, cotizamos tu
                      usado al mejor precio y te ofrecemos servicio de gestoría
                      y aseguradora para que salgas con tu nueva unidad lista
                      para conducir lo mas rápido posible.
                    </p>
                    <p className="mt-4 text-base text-left md:text-center font-normal text-white sm:text-lg">
                      12 años de experiencia en el mercado respaldan nuestra confianza.
                    </p>
                    <p style={{borderBottom: '1px solid red'}} className="mt-10 text-xl mx-0 md:mx-auto  w-fit text-left md:text-center font-semibold text-white sm:text-2xl">
                      Tu próximo auto está acá.
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="pb-0 -mt-24 bg-blueGray-200">
          <div className="container px-4 mx-auto">
            <div className="flex flex-wrap">
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: "some", once: true }}
                transition={{ duration: 0.7, ease: "circInOut", delay: 0.4 }}
                className="w-full px-4 pt-6 text-center lg:pt-12 md:w-4/12"
              >
                <div className="relative flex flex-col w-full min-w-0 mb-8 break-words bg-white rounded-lg shadow-lg">
                  <div className="flex-auto px-4 py-5">
                    <div
                      className="inline-flex items-center justify-center w-12 h-12 p-3 mb-5 text-center text-white rounded-full shadow-lg"
                      style={{ backgroundColor: "#fe171e" }}
                    >
                      <SiCashapp />
                    </div>
                    <h6 className="text-xl font-semibold">Financiación</h6>
                    <p className="mt-2 mb-4 text-base md:text-sm 2xl:text-base text-blueGray-500">
                      Varios planes de financiación para que acceder a tu nuevo
                      vehículo sea más fácil que nunca
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: "some", once: true }}
                transition={{ duration: 0.7, ease: "circInOut", delay: 0.8 }}
                className="w-full px-4 text-center md:w-4/12"
              >
                <div className="relative flex flex-col w-full min-w-0 mb-8 break-words bg-white rounded-lg shadow-lg">
                  <div className="flex-auto px-4 py-5">
                    <div
                      className="inline-flex items-center justify-center w-12 h-12 mb-5 text-center text-white rounded-full shadow-lg"
                      style={{ backgroundColor: "#fe171e" }}
                    >
                      <CgArrowsExchangeAltV size={30} />
                    </div>
                    <h6 className="text-xl font-semibold">
                      Transferimos tu unidad
                    </h6>
                    <p className="mt-2 mb-4 text-base md:text-sm 2xl:text-base text-blueGray-500">
                      Nos encargamos de que salgas de la agencia con tu vehículo
                      transferido a tu nombre
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: "some", once: true }}
                transition={{ duration: 0.7, ease: "circInOut", delay: 1 }}
                className="w-full px-4 pt-6 text-center md:w-4/12"
              >
                <div className="relative flex flex-col w-full min-w-0 mb-8 break-words bg-white rounded-lg shadow-lg">
                  <div className="flex-auto px-4 py-5">
                    <div
                      className="inline-flex items-center justify-center w-12 h-12 mb-5 text-center text-white rounded-full shadow-lg "
                      style={{ backgroundColor: "#fe171e" }}
                    >
                      <IoShieldCheckmarkSharp size={21} className="m-auto" />
                    </div>
                    <h6 className="text-xl font-semibold">
                      Aseguramos tu vehículo
                    </h6>
                    {/* <p className="mt-2 mb-4 text-blueGray-500">
                      Todas las coberturas al mejor precio para que puedas conducir tu nueva unidad
                    </p> */}
                    <p className="mt-2 mb-4 text-base md:text-sm 2xl:text-base text-blueGray-500">
                      Trabajamos con los mejores brokers de seguros. Todas las
                      coberturas al mejor precio.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default Section2;
