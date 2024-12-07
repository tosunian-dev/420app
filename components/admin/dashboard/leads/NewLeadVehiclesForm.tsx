"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { formSchema } from "@/app/schemas/newLeadVehiclesForm";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ICar } from "@/app/models/car";
import styles from "@/app/css-modules/dashboard/leads/newleadform.module.css";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from "react";
import { FaRegCalendar } from "react-icons/fa";
import { IoSpeedometerOutline } from "react-icons/io5";
import { useDebouncedCallback } from "use-debounce";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Camera, Check, ChevronsUpDown } from "lucide-react";
import { carBrands } from "@/app/utils/carBrands";
import { cn } from "@/lib/utils";
import { IAdmin } from "@/app/models/admin";
import { useToast } from "@/hooks/use-toast";
import { ILead } from "@/app/models/lead";

interface props {
  onChangeFormStep: () => void;
  createdLeadData: ILead | undefined;
}

const NewLeadForm = ({ onChangeFormStep, createdLeadData }: props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leadName: "",
      leadYear: "",
      leadKilometers: "",
      leadMotor: "",
      leadType: "",
      leadCurrency: "USD",
      leadPrice: "",
      leadObservations: "",
    },
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const [vehicleList, setVehicleList] = useState<ICar[]>([]);
  const [open, setOpen] = useState(false);
  const [createdVehicle, setCreatedVehicle] = useState<ICar>();
  const modalButtonRef = useRef<HTMLButtonElement>(null);
  const handleClick = () => {
    modalButtonRef.current?.click();
  };
  const pathname = usePathname();
  const { replace } = useRouter();
  const [searchValue, setSearchValue] = useState<string>("");
  const searchParams = useSearchParams();
  const searchFilter = searchParams.get("search");
  const [employees, setEmployees] = useState<IAdmin[]>([]);
  const [selectedIntIn, setSelectedIntIn] = useState<ICar>();
  const [intInImage, setIntInImage] = useState<File>();
  const { toast } = useToast();

  async function getCars(searchParam: string) {
    try {
      const url =
        searchFilter && searchFilter !== "null"
          ? `/api/cars/?search=${searchParam}`
          : `/api/cars/`;
      const carsFetch = await fetch(url, {
        method: "GET",
        cache: "no-store",
      });
      const cars = await carsFetch.json();
      setVehicleList(cars);
      return cars;
    } catch (error) {
      return;
    }
  }

  // create lead vehicles function
  async function onSubmit(values: any) {
    setLoading(true);
    if (!selectedIntIn) {
      setLoading(false);
      toast({
        description: "Selecciona un vehiculo de interés",
        variant: "destructive",
      });
      return;
    }
    values.leadPrefVehicleUUID = selectedIntIn?.uuid;
    values.leadID = createdLeadData?._id;
    values.interestedIn = selectedIntIn?.name;

    let formData = new FormData();
    formData.append("leadVehicleImage", intInImage!);
    formData.append("leadName", values.leadName);
    formData.append("leadYear", values.leadYear);
    formData.append("leadKilometers", values.leadKilometers);
    formData.append("leadMotor", values.leadMotor);
    formData.append("leadType", values.leadType);
    formData.append("leadCurrency", values.leadCurrency);
    formData.append("leadPrice", values.leadPrice);
    formData.append("interestedIn", selectedIntIn?.name!);
    formData.append("leadID", createdLeadData?._id!);
    formData.append("leadPrefVehicleUUID", selectedIntIn?.uuid!);
    formData.append("leadObservations", values.leadObservations);

    console.log("leadVehicleImage", intInImage);

    try {
      const vehicle = await fetch("/api/leads/vehicles", {
        method: "POST",
        body: formData,
      }).then((response) => response.json());
      console.log(vehicle);

      toast({ description: "Vehículos añadidos", variant: "default" });
      onChangeFormStep();
      setLoading(false);

      console.log(vehicle);
    } catch (error) {
      toast({
        description: "Error al añadir vehículos",
        variant: "destructive",
      });
      setLoading(false);
      // error alert
    }
  }

  const handleSearch = useDebouncedCallback((searchValue: string) => {
    const params = new URLSearchParams(searchParams);
    if (searchValue) {
      params.set("search", searchValue);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 400);

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery === null) {
      return setVehicleList([]);
    }
    if (searchQuery) getCars(searchQuery);
  }, [searchParams]);

  useEffect(() => {
    console.log(vehicleList);
  }, [vehicleList]);

  const handleFileInputRefClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {loading && (
        <>
          <div
            className="flex items-center justify-center w-full overflow-y-hidden bg-white dark:bg-background"
            style={{ zIndex: "99999999", height: "50vh" }}
          >
            <div className=" loader"></div>
          </div>
        </>
      )}
      {!loading && (
        <>
          {/* interested in section */}
          {/* <Separator className="my-5" /> */}
          <span className="text-xl font-semibold">Vehiculo de interés</span>
          <div className="flex flex-col items-center justify-center gap-5 mt-8">
            {vehicleList.length === 0 && (
              <h4 className="text-base font-medium">
                Buscá y seleccioná un vehículo
              </h4>
            )}

            {!selectedIntIn && (
              <>
                {/* search */}
                <div className={`w-full md:w-1/3 ${styles.group}`}>
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className={styles.searchicon}
                  >
                    <g>
                      <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                    </g>
                  </svg>

                  <input
                    id="query"
                    onChange={(e) => handleSearch(e.target.value)}
                    className={styles.input}
                    defaultValue={searchParams.get("search")?.toString()}
                    type="search"
                    placeholder="Search..."
                    name="searchbar"
                  />
                </div>

                <div className="grid grid-cols-1 gap-10 sm:gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {vehicleList?.map((car) => (
                    <div key={car.uuid} className="col-span-1 md:h-full h-fit">
                      <Card
                        key={car.uuid}
                        className="flex flex-col h-full shadow-lg"
                      >
                        <Image
                          src={car.imagePath!}
                          alt=""
                          unoptimized
                          width={500}
                          height={500}
                          className="object-cover h-full mb-4 overflow-hidden md:h-1/2 rounded-t-md "
                        />
                        <div className="flex flex-col justify-between w-full h-fit md:h-1/2">
                          <CardHeader style={{ padding: "0 16px 10px 16px" }}>
                            <CardTitle className="text-base textCut">
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
                          <CardFooter className="w-full">
                            <Button
                              onClick={() => setSelectedIntIn(car)}
                              variant={"default"}
                              className="w-full mt-2 md:mt-0"
                            >
                              Asignar vehículo
                            </Button>
                          </CardFooter>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </>
            )}

            {selectedIntIn && (
              <>
                <div className="grid grid-cols-1 gap-10 sm:gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  <div className="col-span-1 md:h-full h-fit">
                    <Card className="flex flex-col h-full shadow-lg">
                      <Image
                        src={selectedIntIn?.imagePath!}
                        alt=""
                        width={500}
                        height={500}
                        className="object-cover h-full mb-4 overflow-hidden md:h-1/2 rounded-t-md "
                      />
                      <div className="flex flex-col justify-between w-full h-fit md:h-1/2">
                        <CardHeader style={{ padding: "0 16px 10px 16px" }}>
                          <CardTitle className="text-base textCut">
                            {selectedIntIn?.name}
                          </CardTitle>
                          <CardDescription className="flex items-center justify-between w-full pt-1 pb-2 ">
                            <div className="flex items-center gap-2">
                              <FaRegCalendar />{" "}
                              <span>{selectedIntIn?.year}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <IoSpeedometerOutline size={20} />
                              <span> {selectedIntIn?.kilometers} km</span>
                            </div>
                          </CardDescription>
                          <p className="text-lg font-semibold">
                            {selectedIntIn?.currency} ${selectedIntIn?.price}
                          </p>
                        </CardHeader>
                        <CardFooter className="w-full">
                          <Button
                            onClick={() => setSelectedIntIn(undefined)}
                            variant={"destructive"}
                            className="w-full mt-2 md:mt-0"
                          >
                            Cambiar vehículo
                          </Button>
                        </CardFooter>
                      </div>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* interested in section */}
          <Separator className="my-10" />
          <span className="text-xl font-semibold">
            Vehiculo del lead{" "}
            <span className="text-base font-normal text-gray-500">
              (opcional)
            </span>
          </span>

          <Form {...form}>
            <form className="mt-5" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col w-full gap-0 xl:gap-10 h-fit xl:flex-row">
                {/* thumbnail */}
                <div
                  className="mx-auto my-5 rounded-full max-w-[350px]  w-fit h-fit inputFileFormProfile"
                  title="Cambiar miniatura"
                >
                  {intInImage === undefined && (
                    <>
                      <CardContent className="w-[300px] h-[300px] xl:w-[350px] xl:h-[350px]  p-0">
                        <Button
                          variant="outline"
                          className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50"
                          onClick={handleFileInputRefClick}
                          type="button"
                        >
                          <Camera className="w-12 h-12 mb-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Seleccionar miniatura
                          </span>
                        </Button>
                        <Input
                          type="file"
                          className="w-0 h-0 overflow-hidden sr-only"
                          ref={fileInputRef}
                          name="image_file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files![0];
                            console.log(file);
                            setIntInImage(file);
                            //uploadImage(file);
                          }}
                        />
                      </CardContent>
                    </>
                  )}
                  {intInImage && (
                    <>
                      <Image
                        width={500}
                        height={500}
                        className="object-cover w-full overflow-hidden rounded-lg "
                        src={URL.createObjectURL(intInImage)}
                        alt=""
                        onClick={handleFileInputRefClick}
                        unoptimized
                      />
                      <Input
                        type="file"
                        className="w-0 h-0 overflow-hidden sr-only"
                        ref={fileInputRef}
                        name="image_file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files![0];
                          console.log(file);
                          setIntInImage(file);
                          //uploadImage(file);
                        }}
                      />
                    </>
                  )}
                </div>

                <div className="">
                  <div className="grid grid-cols-1 gap-4 mt-6 md:gap-10 md:grid-cols-2">
                    {/* product name */}
                    <div className="flex flex-col gap-4 md:gap-8">
                      <FormField
                        control={form.control}
                        name="leadName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre del vehiculo</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ej. Chevrolet Cruze LTZ 1.4T"
                                type="text"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex col-span-2 gap-2">
                        <FormField
                          control={form.control}
                          name="leadCurrency"
                          render={({ field }) => (
                            <FormItem className="w-fit">
                              <FormLabel>Precio</FormLabel>
                              <Select
                                defaultValue={field.value}
                                onValueChange={field.onChange}
                                {...field}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="ARS">ARS</SelectItem>
                                  <SelectItem value="USD">USD</SelectItem>
                                </SelectContent>
                              </Select>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="leadPrice"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel className="opacity-0">-</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Ingresa un precio"
                                  type="number"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    {/* year and brand */}
                    <div className="grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="leadType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de vehículo</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              {...field}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="CAR">Automóvil</SelectItem>
                                <SelectItem value="BIKE">
                                  Motocicleta
                                </SelectItem>
                                <SelectItem value="QUAD">
                                  Cuatriciclo
                                </SelectItem>
                                <SelectItem value="UTV">UTV</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="leadKilometers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kilómetros</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ingresa un kilometraje"
                                type="number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="leadMotor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Motor</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ej. 2.0 TSI"
                                type="text"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="leadYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Año</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ingresa un año"
                                type="number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="leadObservations"
                    render={({ field }) => (
                      <FormItem className="w-full pr-0 mt-4 md:mt-8 md:w-1/2 md:pr-5 ">
                        <FormLabel>
                          Observaciones <span className="">(opcional)</span>
                        </FormLabel>
                        <Textarea
                          {...field}
                          placeholder="Ingresa una descripción"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div></div>

              <div className="flex flex-col justify-center w-full gap-5 my-12 md:flex-row md:gap-8">
                <Button
                  type="button"
                  variant={"outline"}
                  className="w-full md:w-1/3"
                >
                  Añadir mas tarde
                </Button>
                <Button type="submit" className="w-full md:w-1/3">
                  Finalizar
                </Button>
              </div>
            </form>
          </Form>
        </>
      )}
    </>
  );
};

export default NewLeadForm;
