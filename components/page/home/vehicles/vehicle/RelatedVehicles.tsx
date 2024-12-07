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
import EmblaCarousel, { EmblaPluginType } from "embla-carousel";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaRegCalendar } from "react-icons/fa";
import { IoSpeedometerOutline } from "react-icons/io5";

interface Props {
  vehicles: ICar[];
}

const RelatedVehicles = ({ vehicles }: Props) => {
  const [api, setApi] = useState<CarouselApi>();
  const [latestVehicles, setLatestVehicles] = useState<ICar[]>([]);
  const [current, setCurrent] = useState(0);
  const router = useRouter();

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
      <section className="flex flex-col justify-center w-full gap-5 py-20 md:py-44 align-middle md:gap-8">
        <motion.header
          initial={{ opacity: 0, y: -70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: "some", once: true }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="flex flex-col items-start justify-center w-full px-6 sm:items-center"
        >
          <div className="flex flex-col ">
            <span className="text-sm font-bold text-red-500 upper sm:text-base">
              Vehiculos relacionados
            </span>
            <h4 className="text-xl font-bold sm:text-2xl">
              Unidades que podrían interesarte
            </h4>
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
                      <Card className="flex flex-col h-full shadow-lg">
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
                            <CardTitle className="text-lg textCut">
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
                            <p className="text-lg font-semibold">
                              {car.currency} ${car.price}
                            </p>
                          </CardHeader>
                          <CardFooter className="px-4 pb-5 mt-5 md:mt-0">
                            <Link
                              href={`/vehicles/${car.uuid}`}
                              className="w-full h-fit"
                            >
                              <Button variant={"default"} className="w-full">
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
          {/* Custom Indicators */}
          <div className="flex justify-center mt-6 space-x-2 md:mt-10">
            {latestVehicles.map((dot, index) => (
              <button
                key={dot.uuid}
                className={`w-2 h-2 rounded-full ${
                  index === current ? "bg-black" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-center w-full mt-4 h-fit">
          <button
            onClick={() => router.push("/vehicles")}
            className={`${stylesSearch.button}`}
          >
            Volver a vehículos
          </button>{" "}
        </div>
      </section>
    </>
  );
};

export default RelatedVehicles;
