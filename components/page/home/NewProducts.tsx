"use client";
import Autoplay from "embla-carousel-autoplay";
import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import stylesSearch from "@/app/css-modules/home.search.module.css";
import { Button } from "@/components/ui/button";
import { ICar } from "@/app/models/car";
import { motion } from "framer-motion";
import { FaRegCalendar } from "react-icons/fa";
import { IoSpeedometerOutline } from "react-icons/io5";
import Link from "next/link";

interface Props {
  vehicles: ICar[];
}

const NewProducts = ({ vehicles }: Props) => {
  const [api, setApi] = useState<CarouselApi>();
  const [latestVehicles, setLatestVehicles] = useState<ICar[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    setLatestVehicles(vehicles);
  }, [vehicles]);

  useEffect(() => {
    console.log(latestVehicles);
  }, [latestVehicles]);

  const plugin = React.useRef(
    Autoplay({ delay: 3500, stopOnInteraction: false })
  );

  return (
    <>
      <section className="flex flex-col justify-center w-full gap-8 my-16 align-middle h-fit xl:h-screen md:gap-8 2xl:gap-12 md:my-14 2xl:my-0">
        <motion.header
          initial={{ opacity: 0, y: -70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: "some", once: true }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="flex flex-col items-start justify-center px-6 overflow-visible md:overflow-hidden md:hidden"
        >
          <div className="flex flex-col ">
            <span className="text-base font-bold text-red-500  ">
              Últimos ingresos
            </span>
            <h4 className="text-2xl font-bold md:text-lg 2xl:text-2xl ">
              Estas son nuestras unidades mas recientes
            </h4>
          </div>
        </motion.header>
        <motion.header
          initial={{ opacity: 0, y: -70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: "some", once: true }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="flex-row items-start justify-between hidden w-full px-6 mx-auto md:flex md:max-w-6xl "
        >
          <div className="flex flex-col ">
            <span className="text-sm font-bold text-red-500 upper sm:text-base">
              Últimos ingresos
            </span>
            <h4 className="text-2xl font-bold md:text-2xl 2xl:text-2xl ">
              Estas son nuestras unidades mas recientes
            </h4>
          </div>
          <div className="flex justify-center mt-4 w-fit h-fit">
            <Link href={"/vehicles"} className="w-fit h-fit">
              <button className={`${stylesSearch.button}`}>
                Ver todos los vehículos
              </button>{" "}
            </Link>
          </div>
        </motion.header>
        <div className="w-full mx-auto overflow-hidden">
          <motion.div
            className=""
            initial={{ opacity: 0, x: 70 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: "some", once: true }}
            transition={{ duration: 0.7, ease: "easeInOut", delay: 0.5 }}
          >
            <Carousel
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
              setApi={setApi}
              plugins={[plugin.current as any]}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full mx-auto md:max-w-6xl"
            >
              <CarouselContent className="w-full mx-auto h-fit sm:pl-0">
                {latestVehicles.map((car) => (
                  <CarouselItem
                    key={car.uuid}
                    className="px-5 xs:basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <div className="p-1 md:h-full h-fit">
                      <Card className="flex unselectable flex-col md:max-h-[400px] max-h-full 2xl:max-h-full  h-full shadow-lg">
                        <Image
                          src={car?.imagePath!}
                          alt="auto"
                          width={500}
                          height={500}
                          unoptimized
                          className="object-cover h-full mb-4 overflow-hidden rounded-t-md md:h-1/2 "
                        />
                        <div className="flex flex-col justify-between w-full h-full md:h-1/2">
                          <CardHeader style={{ padding: "0 16px 0px 16px" }}>
                            <CardTitle className="text-lg md:text-base 2xl:text-lg textCut ">
                              {car.name}
                            </CardTitle>
                            <CardDescription className="flex items-center justify-between w-full pt-1 pb-2 ">
                              <div className="flex items-center gap-2">
                                <FaRegCalendar /> <span>{car.year}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <IoSpeedometerOutline size={20} />
                                <span> {car.kilometers} km</span>
                              </div>
                            </CardDescription>
                            <p className="text-lg md:text-base 2xl:text-lg font-semibold">
                              {car.currency} ${car.price}
                            </p>
                          </CardHeader>
                          <CardFooter className="px-4 pb-5 mt-5 md:mt-0">
                            <Link
                              href={`/vehicles/${car.uuid}`}
                              className="w-full h-fit"
                            >
                              <Button
                                variant={"default"}
                                className="w-full text-lg md:text-xs 2xl:text-lg"
                              >
                                Ver más
                              </Button>
                            </Link>
                          </CardFooter>
                        </div>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </motion.div>
          {/* <div className="flex gap-3 ">
            <Button onClick={() => api?.scrollTo(current - 1)}>-</Button>
            <Button onClick={() => api?.scrollTo(current + 1)}>+</Button>
          </div> */}
        </div>
        {/* Custom Indicators */}
        <div className="flex justify-center space-x-2 ">
          {latestVehicles.map((dot, index) => (
            <button
              key={dot.uuid}
              className={`w-2 h-2 rounded-full ${
                index === current ? "bg-black" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
        <div className="flex justify-center w-full mt-4 md:hidden h-fit">
          <Link className="w-fit h-fit" href={"/vehicles"}>
            <button className={`${stylesSearch.button}`}>
              Ver todos los vehículos
            </button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default NewProducts;
