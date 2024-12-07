"use client";
import { Separator } from "@/components/ui/separator";
import React, { cache, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import Link from "next/link";
import { FaRegCalendar, FaRegEdit, FaWhatsapp } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { MdLocalPhone, MdPersonSearch } from "react-icons/md";
import { CheckIcon } from "lucide-react";
import { ILead } from "@/app/models/lead";
import { IoSpeedometerOutline } from "react-icons/io5";
import { ICar } from "@/app/models/car";
import { ILeadVehicle } from "@/app/models/leadvehicles";
import { useParams } from "next/navigation";
import Image from "next/image";
import { IoIosAddCircleOutline } from "react-icons/io";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { formSchema } from "@/app/schemas/addBonifForm";
import { TiDelete } from "react-icons/ti";
import { Label } from "@/components/ui/label";
import { log } from "console";
import { FiDownload } from "react-icons/fi";
import { BiMailSend } from "react-icons/bi";
import Budget from "./Budget";

export interface IBonif {
  amount: string;
  addOrSub: string;
  details: string;
  _id?: string;
  budgetID?: string;
}

const CreateBudgetForm = () => {
  const [open, setOpen] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [selectedLead, setSelectedLead] = useState<ILead>();
  const [leads, setLeads] = useState<ILead[]>();
  const [intInVehicle, setIntInVehicle] = useState<ICar>();
  const [leadVehicles, setLeadVehicles] = useState<ILeadVehicle>();
  const [bonificaciones, setBonificaciones] = useState([]);
  const params = useParams();
  const [createBonifModal, setCreateBonifModal] = useState<boolean>(false);
  const [currency, setCurrency] = useState("");
  const [USDValue, setUSDValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [bonifToCreate, setBonifToCreate] = useState({
    details: "",
    amount: null,
    addOrSub: "-",
  });
  const formCreate = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      details: "",
      amount: "",
      addOrSub: "-",
    },
  });
  const [intInVehicleBonifs, setIntInVehicleBonifs] = useState<IBonif[]>([]);
  const [leadVehicleBonifs, setLeadVehicleBonifs] = useState<IBonif[]>([]);
  const [createLeadVehicBonifModal, setCreateLeadVehicBonifModal] =
    useState(false);
  const [initialIntInCurrency, setInitialIntInCurrency] = useState<{
    price: number;
    currency: "USD" | "ARS";
  }>();
  const [initialLeadVehicleCurrency, setInitialLeadVehicleCurrency] = useState<{
    price: number;
    currency: "USD" | "ARS";
  }>();
  const [transfer, setTransfer] = useState<number>(0);
  const [transferFixed, setTransferFixed] = useState<number>();
  const [intInVehicleBonifsSubtotal, setIntInVehicleBonifsSubtotal] =
    useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  // get lead, leadVehicles and intInVehicle
  async function getLead() {
    try {
      const leadFetch = await fetch(`/api/leads/${params.id}`, {
        method: "GET",
        cache: "no-store",
      });
      const lead = await leadFetch.json();
      setLeadVehicles(lead.leadVehicles);
      setSelectedLead(lead.lead);
      setCurrency(lead.intInVehicle.currency);
      setIntInVehicle(lead.intInVehicle);
      setInitialIntInCurrency({
        currency: lead.intInVehicle.currency,
        price: lead.intInVehicle.price,
      });
      setInitialLeadVehicleCurrency({
        currency: lead.leadVehicles.leadCurrency,
        price: parseInt(lead.leadVehicles.leadPrice),
      });
      setLoading(false);
    } catch (error) {
      return;
    }
  }
  // get lead, leadVehicles and intInVehicle

  // currency handlers
  function convertVehiclesPriceByCurrency(USDvalue: number) {
    console.log(initialIntInCurrency?.currency);
    console.log(currency);

    // set back values when usd is set back
    if (initialIntInCurrency?.currency === "USD" && currency === "USD") {
      console.log("set to usd");
      if (USDValue === null) return;
      setIntInVehicle((prev) => {
        if (!prev || USDvalue === null) return;
        let newData = { ...(prev.toObject?.() || prev) };
        newData.currency = initialIntInCurrency?.currency!;
        newData.price = initialIntInCurrency?.price!;
        console.log(newData);

        return newData;
      });
      setLeadVehicles((prev) => {
        if (!prev || USDvalue === null) return;
        let newData = { ...(prev.toObject?.() || prev) };
        newData.leadCurrency = initialLeadVehicleCurrency?.currency!;
        console.log(initialLeadVehicleCurrency?.price!);
        newData.leadPrice = initialLeadVehicleCurrency?.price!;
        console.log(newData);

        return newData;
      });
      return;
    }

    // set back values when ars is set back
    if (initialIntInCurrency?.currency === "ARS" && currency === "ARS") {
      console.log("set to ars");

      setIntInVehicle((prev) => {
        if (!prev || USDvalue === null) return;
        let newData = { ...(prev.toObject?.() || prev) };
        newData.currency = initialIntInCurrency?.currency!;
        newData.price = initialIntInCurrency?.price!;
        return newData;
      });
      setLeadVehicles((prev) => {
        if (!prev || USDvalue === null) return;
        let newData = { ...(prev.toObject?.() || prev) };
        newData.leadCurrency = initialLeadVehicleCurrency?.currency!;
        newData.leadPrice = initialLeadVehicleCurrency?.price!;
        return newData;
      });
    }

    // convert price and currency value
    if (currency === "USD") {
      setIntInVehicle((prev) => {
        if (!prev) return;
        let newData = { ...(prev.toObject?.() || prev) };
        newData.currency = "USD";
        newData.price = initialIntInCurrency?.price!;
        return newData;
      });
      setLeadVehicles((prev) => {
        if (!prev) return;
        let newData = { ...(prev.toObject?.() || prev) };
        newData.leadCurrency = "USD";
        newData.leadPrice = initialIntInCurrency?.price!;
        return newData;
      });
      return;
    }

    // convert price and currency value
    if (currency === "ARS") {
      console.log("convert price and currency value");
      console.log(initialIntInCurrency?.currency);

      if (initialIntInCurrency?.currency === "ARS") return;
      if (Number.isNaN(USDvalue)) {
        setIntInVehicle((prev) => {
          if (!prev || USDvalue === null) return;
          let newData = { ...(prev.toObject?.() || prev) };
          newData.currency = "USD";
          newData.price = initialIntInCurrency?.price!;
          return newData;
        });
        setLeadVehicles((prev) => {
          if (!prev || USDvalue === null) return;
          let newData = { ...(prev.toObject?.() || prev) };
          newData.leadCurrency = "USD";
          newData.leadPrice = initialLeadVehicleCurrency?.price!;
          return newData;
        });
        return;
      }
      setIntInVehicle((prev) => {
        if (!prev || USDvalue === null) return;
        let newData = { ...(prev.toObject?.() || prev) };
        newData.currency = "ARS";
        newData.price = initialIntInCurrency?.price! * USDvalue;
        return newData;
      });
      setLeadVehicles((prev) => {
        if (!prev || USDvalue === null) return;
        let newData = { ...(prev.toObject?.() || prev) };
        newData.leadCurrency = "ARS";
        newData.leadPrice = initialLeadVehicleCurrency?.price! * USDvalue;
        return newData;
      });
    }
  }

  // currency handlers

  // bonif handlers
  function onSubmitIntInBonif(values: any) {
    formCreate.reset();
    setCreateBonifModal(false);
    console.log(values);
    setIntInVehicleBonifs((prev) => {
      return [...prev, values];
    });
  }
  function onSubmitLeadVehicBonif(values: any) {
    setCreateLeadVehicBonifModal(false);
    console.log(values);
    setLeadVehicleBonifs((prev) => {
      return [...prev, values];
    });
  }
  function onDeleteIntInBonif(details: string) {
    setIntInVehicleBonifs((prev) => {
      const newState = prev.filter((bonif) => bonif.details !== details);
      return newState;
    });
  }
  function onDeleteLeadVehicBonif(details: string) {
    setLeadVehicleBonifs((prev) => {
      const newState = prev.filter((bonif) => bonif.details !== details);
      return newState;
    });
  }
  // bonif handlers

  // set bonificaciones subtotal
  function calcBonifSubtotal() {
    let subtotal = 0;
    const price = intInVehicleBonifs.map((bonif) => {
      if (bonif.addOrSub === "-") {
        console.log("resta");

        subtotal = subtotal - Number(bonif.amount);
      }
      if (bonif.addOrSub === "+") {
        console.log("suma");

        subtotal = subtotal + Number(bonif.amount);
      }
    });
    setIntInVehicleBonifsSubtotal(subtotal);
  }

  function calcTotal() {
    let total = 0;
    console.log(intInVehicle?.price!);
    console.log(intInVehicleBonifsSubtotal);
    console.log(Number(leadVehicles?.leadPrice));
    console.log(transfer);

    total =
      intInVehicle?.price! +
      intInVehicleBonifsSubtotal -
      Number(leadVehicles?.leadPrice) +
      transfer;

    setTotal(total);
  }

  useEffect(() => {
    calcTotal();
  }, [
    intInVehicleBonifsSubtotal,
    transfer,
    USDValue,
    currency,
    intInVehicle?.price,
  ]);

  // useEffects
  useEffect(() => {
    calcBonifSubtotal();
  }, [intInVehicleBonifs]);

  useEffect(() => {
    if (currency === "USD") {
      convertVehiclesPriceByCurrency(USDValue!);
    }
  }, [currency]);
  useEffect(() => {
    console.log(setBonifToCreate);
  }, [setBonifToCreate]);
  useEffect(() => {
    getLead();
  }, []);

  // useEffects

  return (
    <>
      {loading && (
        <>
          <div
            className="flex items-center justify-center w-full overflow-y-hidden bg-white dark:bg-background"
            style={{ zIndex: "99999999", height: "67vh" }}
          >
            <div className=" loader"></div>
          </div>
        </>
      )}

      {!loading && (
        <>
          {/* seccion 1  */}
          <Card className="flex flex-col p-5">
            {/* title */}
            <span className="text-lg font-semibold sm:text-xl">
              1. Seleccionar cliente y moneda
            </span>
            {/* title */}
            {/* informacion del cliente */}
            <Card className="flex flex-col gap-0 p-5 mt-4 md:gap-10 md:flex-row ">
              <div className="w-full md:w-1/2 ">
                <div className="flex flex-col items-start justify-between mb-5 sm:items-center md:flex-row">
                  <div className="flex flex-wrap justify-between w-full gap-2 md:justify-start md:gap-5">
                    <span className="text-xl font-semibold sm:text-xl lg:text-2xl">
                      {selectedLead?.name} {selectedLead?.surname}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col w-full gap-10 md:flex-row h-fit">
                  <div className="flex flex-col justify-between w-full gap-3 sm:gap-0 md:gap-5 h-fit">
                    <div className="flex flex-col w-full gap-3">
                      <span className="text-sm font-semibold">
                        Información de contacto
                      </span>
                      <Separator className="" />
                      <div className="flex flex-col flex-wrap gap-3 md:gap-4">
                        <div className="flex items-center gap-2 w-fit h-fit">
                          <HiOutlineMail />
                          <span className="text-sm">{selectedLead?.email}</span>
                        </div>
                        <div className="flex items-center gap-2 w-fit h-fit">
                          <MdLocalPhone />
                          <span className="text-sm">
                            {selectedLead?.phone}{" "}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 w-fit h-fit">
                          <span className="text-sm">
                            <b>Tipo de negocio:</b> {selectedLead?.businessType}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Separator className="block my-7 md:hidden" orientation="horizontal" />
              <div className="w-full md:w-1/2">
                <div className="flex flex-col justify-between w-full py-0 mt-0 gap-7 md:py-3 md:mt-0 md:justify-end sm:gap-8">
                  <div className="grid w-full max-w-full md:max-w-sm items-center gap-1.5">
                    <Label htmlFor="email">Moneda</Label>
                    <span className="text-xs font-light text-gray-400">
                      Selecciona la divisa en la que querés realizar el
                      presupuesto
                    </span>
                    <Separator
                      className="mt-1 mb-2 "
                      orientation="horizontal"
                    />
                    <Select
                      defaultValue={currency}
                      value={currency}
                      onValueChange={(value) => {
                        setCurrency(value);
                        //convertVehiclesPriceByCurrency(1);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar moneda" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="USD">Dólar</SelectItem>
                          <SelectItem value="ARS">Peso argentino</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {currency === "ARS" && (
                    <div className="grid mb-3 md:mb-0 w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="email">Cotización del dolar</Label>
                      <span className="text-xs font-light text-gray-400">
                        Ingresa la cotización del dolar para convertir los montos del presupuesto a peso argentino
                      </span>
                      <Separator
                        className="mt-1 mb-2 "
                        orientation="horizontal"
                      />
                      <Input
                        onChange={(value) => {
                          console.log(value.target.value);
                          setUSDValue(parseInt(value.target.value));
                          convertVehiclesPriceByCurrency(
                            parseInt(value.target.value)
                          );
                        }}
                        type="number"
                        id="transferPrice"
                        placeholder="Ingresá una cifra"
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>
            {/* informacion del cliente */}
          </Card>

          {/* seccion 2 */}
          <Card className="mt-10 p-7">
            <div className="flex flex-col justify-center w-full gap-10 md:gap-0 h-fit">
              {/* Vehiculo de interés */}
              <div className="w-full">
                <span className="text-xl font-semibold">
                  2. Vehiculo de interés
                </span>
                <div className="flex items-center justify-center gap-5 mt-8 sm:items-start">
                  <div className="flex flex-col w-full h-full lg:flex-row ">
                    {/* vehicle details */}
                    <Card className="flex flex-col h-full max-w-full sm:max-w-[250px] shadow-lg">
                      <Image
                        src={intInVehicle?.imagePath!}
                        alt=""
                        unoptimized
                        width={500}
                        height={500}
                        className="object-cover h-full mb-4 overflow-hidden md:h-1/2 rounded-t-md "
                      />
                      <div className="flex flex-col justify-between w-full h-fit md:h-1/2">
                        <CardHeader style={{ padding: "0 16px 10px 16px" }}>
                          <CardTitle className="text-base textCut">
                            {/* {car.name} */}
                            {intInVehicle?.name}
                          </CardTitle>
                          <CardDescription className="flex items-center justify-between w-full pt-1 pb-2 ">
                            <div className="flex items-center gap-2">
                              {/* <FaRegCalendar /> <span>{car.year}</span> */}
                              <FaRegCalendar />{" "}
                              <span> {intInVehicle?.year}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <IoSpeedometerOutline size={20} />
                              {/* <span> {car.kilometers} km</span> */}
                              <span> {intInVehicle?.kilometers} km</span>
                            </div>
                          </CardDescription>
                          <span className="text-lg font-semibold">
                            {/* {car.currency} ${car.price} */}
                            {intInVehicle?.currency} $
                            {intInVehicle?.price.toLocaleString()}
                          </span>
                        </CardHeader>
                        <CardFooter className="w-full p-4">
                          <Link
                            className="w-full h-full"
                            href={
                              "/admin/dashboard/leads/edit/" + selectedLead?._id
                            }
                          >
                            <Button
                              //onClick={() => setSelectedIntIn(car)}
                              variant={"default"}
                              className="w-full mt-2 md:mt-0"
                            >
                              Cambiar vehículo
                            </Button>
                          </Link>
                        </CardFooter>
                      </div>
                    </Card>

                    <Separator
                      className="mx-7 h-[300px] my-auto hidden lg:block"
                      orientation="vertical"
                    />

                    <div className="flex flex-col w-full h-full mt-7 lg:mt-0 xl:flex-row">
                      {/* bonificaciones section */}
                      <div className="flex flex-col w-full max-w-full md:max-w-[400px] ">
                        <div className="flex flex-col w-full gap-2 h-fit">
                          <Label htmlFor="email" className="text-lg">
                            Bonificaciones
                          </Label>
                          <span className="text-xs font-light text-gray-400">
                            Ingresa el costo de transferencia en{" "}
                            <b>pesos argentinos.</b> De ser el presupuesto hecho
                            en dólares, será convertido con la cotización
                            ingresada
                          </span>
                        </div>
                        <Separator
                          className="my-3 opacity-70 xl:my-3"
                          orientation="horizontal"
                        />
                        <div className="w-full h-fit">
                          {intInVehicleBonifs.length === 0 && (
                            <div className="justify-center w-full p-2 text-center h-fit">
                              <span className="text-sm font-normal ">
                                No hay bonificaciones.
                              </span>
                            </div>
                          )}
                          {intInVehicleBonifs.length > 0 &&
                            intInVehicleBonifs.map((bonif) => (
                              <>
                                <div className="flex justify-between py-1">
                                  <span className="text-sm font-semibold">
                                    {bonif.details}{" "}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm ">
                                      {bonif.addOrSub}${bonif.amount}{" "}
                                    </span>
                                    <TiDelete
                                      className="cursor-pointer "
                                      onClick={() =>
                                        onDeleteIntInBonif(bonif.details)
                                      }
                                      size={25}
                                      color="red"
                                    />
                                  </div>
                                </div>
                              </>
                            ))}
                        </div>
                        <Button
                          className="mt-5"
                          onClick={() => setCreateBonifModal(true)}
                        >
                          Añadir bonificación
                        </Button>
                      </div>

                      <Separator
                        className="mx-7 h-[300px] my-auto hidden xl:block"
                        orientation="vertical"
                      />

                      <Separator
                        className="block w-full md:w-[400px]  my-10 xl:hidden"
                        orientation="horizontal"
                      />

                      {/* transfer value section */}
                      <div className="flex flex-col w-full md:w-fit mt-0 md:mt-0 min-w-0 sm:min-w-[250px]">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                          <Label htmlFor="email" className="text-lg">
                            Gastos de transferencia
                          </Label>
                          <span className="text-xs font-light text-gray-400">
                            Ingresa el costo de transferencia en{" "}
                            <b>pesos argentinos.</b> De ser el presupuesto hecho
                            en dólares, será convertido con la cotización
                            ingresada
                          </span>
                          <Separator
                            className="my-3 opacity-70 xl:my-2"
                            orientation="horizontal"
                          />
                          <Label htmlFor="email" className="text-sm">
                            Costo de transferencia
                          </Label>
                          <span className="mb-1 text-xs font-light text-gray-400">
                            Ingresa el monto a pagar para transferir el vehículo
                          </span>
                          <Input
                            type="number"
                            onChange={(e) => {
                              setTransferFixed(Number(e.target.value));
                              if (
                                currency === "USD" &&
                                USDValue &&
                                transferFixed
                              ) {
                                setTransfer(Number(e.target.value) / USDValue!);
                                return;
                              }
                              setTransfer(transfer);
                            }}
                            id="transferPrice"
                            placeholder="Ingresá una cifra"
                          />
                        </div>
                        {currency === "USD" && (
                          <div className="mt-5 grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="email" className="text-sm">
                              Cotización del dolar
                            </Label>
                            <span className="mb-1 text-xs font-light text-gray-400">
                              Ingresa la cotización del dolar para convertir el
                              precio
                            </span>
                            <Input
                              onChange={(value) => {
                                setUSDValue(parseInt(value.target.value));
                                if (currency === "USD" && transferFixed) {
                                  setTransfer(
                                    transferFixed / Number(value.target.value)!
                                  );
                                  return;
                                }
                                setTransfer(transfer);
                              }}
                              type="number"
                              id="transferPrice"
                              placeholder="Ingresá una cifra"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Vehiculo de interés */}

              <Separator className="my-4 md:my-10" orientation="horizontal" />

              {/* Vehiculo del lead */}
              <div className="w-full h-full ">
                <span className="text-xl font-semibold">
                  Vehiculo del lead{" "}
                  <span className="text-base font-normal text-gray-500">
                    (opcional)
                  </span>
                </span>
                {leadVehicles?.leadName === "" && (
                  <Link
                    href={"/admin/dashboard/leads/edit/" + selectedLead?._id}
                    className=" opacity-50 flex flex-col items-center justify-center w-full min-h-[350px] h-full"
                  >
                    <IoIosAddCircleOutline size={50} strokeWidth={0} />
                    <span>Añadir vehículo</span>
                  </Link>
                )}
                {leadVehicles?.leadName !== "" && (
                  <div className="flex flex-col items-center justify-center gap-5 mt-8 sm:items-start">
                    <div className="flex flex-col w-full h-full max-w-full md:flex-row ">
                      <Card className="lex flex-col h-full max-w-full sm:max-w-[270px] shadow-lg">
                        <Image
                          src={leadVehicles?.leadVehicleImage!}
                          alt=""
                          unoptimized
                          width={500}
                          height={500}
                          className="object-cover h-full mb-4 overflow-hidden md:h-1/2 rounded-t-md "
                        />
                        <div className="flex flex-col justify-between w-full h-fit md:h-1/2">
                          <CardHeader style={{ padding: "0 16px 10px 16px" }}>
                            <CardTitle className="text-base textCut">
                              {/* {car.name} */}
                              {leadVehicles?.leadName}
                            </CardTitle>
                            <CardDescription className="flex items-center justify-between w-full pt-1 pb-2 ">
                              <div className="flex items-center gap-2">
                                {/* <FaRegCalendar /> <span>{car.year}</span> */}
                                <FaRegCalendar />{" "}
                                <span> {leadVehicles?.leadYear}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <IoSpeedometerOutline size={20} />
                                {/* <span> {car.kilometers} km</span> */}
                                <span> {leadVehicles?.leadKilometers} km</span>
                              </div>
                            </CardDescription>
                            <span className="text-lg font-semibold">
                              {leadVehicles?.leadCurrency} $
                              {Number(leadVehicles?.leadPrice).toLocaleString()}
                            </span>
                          </CardHeader>
                          <CardFooter className="w-full p-4">
                            <Link
                              className="w-full h-full"
                              href={
                                "/admin/dashboard/leads/edit/" +
                                selectedLead?._id
                              }
                            >
                              <Button
                                //onClick={() => setSelectedIntIn(car)}
                                variant={"default"}
                                className="w-full mt-2 md:mt-0"
                              >
                                Editar vehículo
                              </Button>
                            </Link>
                          </CardFooter>
                        </div>
                      </Card>

                      <Separator
                        className="mx-10 h-[300px] my-auto hidden md:block"
                        orientation="vertical"
                      />

                      <div className="flex flex-col w-full md:w-fit mt-8 md:mt-0 min-w-0 md:min-w-[350px] ">
                        <span className="font-bold">Bonificaciones</span>
                        <Separator
                          className="mt-1 mb-4 "
                          orientation="horizontal"
                        />
                        <div className="w-full">
                          {leadVehicleBonifs.length === 0 && (
                            <div className="justify-center w-full py-4 text-center h-fit">
                              <span className="text-sm font-normal">
                                No hay bonificaciones.
                              </span>
                            </div>
                          )}
                          {leadVehicleBonifs.length > 0 &&
                            leadVehicleBonifs.map((bonif) => (
                              <>
                                <div className="flex justify-between py-1">
                                  <span className="text-sm font-semibold">
                                    {bonif.details}{" "}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm ">
                                      {bonif.addOrSub}${bonif.amount}{" "}
                                    </span>
                                    <TiDelete
                                      className="cursor-pointer "
                                      onClick={() =>
                                        onDeleteLeadVehicBonif(bonif.details)
                                      }
                                      size={25}
                                      color="red"
                                    />
                                  </div>
                                </div>
                              </>
                            ))}
                        </div>
                        <Button
                          className="mt-5"
                          onClick={() => setCreateLeadVehicBonifModal(true)}
                        >
                          Añadir bonificación
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Vehiculo del lead */}
            </div>
          </Card>

          {/* resumen de presupuesto */}
          <Card className="p-5 mt-10">
            <span className="text-lg font-semibold md:text-xl">
              Resumen de presupuesto
            </span>
            <Card className="w-full p-5 my-6 md:w-1/2">
              {/* precio del vehiculo */}
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between w-full">
                  <span className="text-sm font-semibold">
                    Precio del vehículo
                  </span>
                  <span className="text-sm font-semibold">
                    {intInVehicle?.currency} $
                    {intInVehicle?.price.toLocaleString()}{" "}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {intInVehicle?.name}
                </span>
              </div>
              {/* precio del vehiculo */}
              {/* bonificaciones */}
              {intInVehicleBonifs.length > 0 && (
                <>
                  <Separator className="my-5 " orientation="horizontal" />
                  <div className="flex flex-col mt-5">
                    <span className="mb-3 text-sm font-semibold ">
                      Bonificaciones
                    </span>
                    {/* <Separator className="my-1" orientation="horizontal" /> */}
                    <div className="flex flex-col gap-2">
                      {intInVehicleBonifs.map((bonif) => (
                        <>
                          <div className="flex items-start justify-between w-full">
                            <span className="text-sm font-normal text-gray-400">
                              {bonif.details}
                            </span>
                            <span className="text-sm text-gray-400 ">
                              {bonif.addOrSub} {currency} $
                              {bonif.amount.toLocaleString()}{" "}
                            </span>
                          </div>
                        </>
                      ))}
                    </div>
                    <div className="flex items-start justify-between w-full mt-2">
                      <span className="text-sm font-semibold">
                        Subtot. de bonificaciones
                      </span>
                      <span className="text-sm font-semibold">
                        {Number(intInVehicleBonifsSubtotal.toLocaleString()) < 0
                          ? "-"
                          : ""}{" "}
                        {currency} $
                        {Number(intInVehicleBonifsSubtotal.toLocaleString()) < 0
                          ? Number(
                              intInVehicleBonifsSubtotal.toLocaleString()
                            ) * -1
                          : Number(intInVehicleBonifsSubtotal.toLocaleString())}
                      </span>
                    </div>
                  </div>
                </>
              )}
              {/* bonificaciones */}

              <Separator className="my-5 " orientation="horizontal" />

              {/* entrega de usado */}
              {leadVehicles?.leadName !== "" && (
                <>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between w-full">
                      <span className="text-sm font-semibold">
                        Entrega de vehículo
                      </span>
                      <span className="text-sm font-semibold">
                        - {leadVehicles?.leadCurrency} $
                        {Number(leadVehicles?.leadPrice).toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {leadVehicles?.leadName}
                    </span>
                  </div>
                </>
              )}
              {/* entrega de usado */}

              <Separator className="my-5 " orientation="horizontal" />

              {/* costos de transferencia */}
              <div className="flex items-start justify-between w-full">
                <span className="text-sm font-semibold">
                  Costos de transferencia
                </span>
                <span className="text-sm font-semibold">
                  {currency} ${transfer.toFixed(2).toLocaleString()}
                </span>
              </div>
              {/* costos de transferencia */}

              <Separator className="my-5 " orientation="horizontal" />

              {/* total a pagar */}
              <div className="flex items-start justify-between w-full">
                <span className="text-sm font-semibold">Total a pagar</span>
                <span className="text-sm font-semibold">
                  {currency} ${total.toFixed(2).toLocaleString()}
                </span>
              </div>
              {/* total a pagar */}
            </Card>

            <div className="flex flex-wrap justify-center w-full gap-5 overflow-y-hidden">
              <Budget
                intInVehicle={intInVehicle}
                intInVehicleBonifs={intInVehicleBonifs}
                intInVehicleBonifsSubtotal={intInVehicleBonifsSubtotal}
                leadVehicles={leadVehicles}
                lead={selectedLead}
                currency={currency}
                transfer={transfer}
                total={total}
              />
              {/* <Button className="w-full gap-2 md:w-fit">
            <FiDownload size={20} />
            Guardar como PDF
          </Button> */}
              {/* <Button className="w-full gap-2 text-white bg-green-700 hover:bg-green-900 md:w-fit">
            <FaWhatsapp size={20} />
            Enviar por WhatsApp
          </Button>
          <Button className="w-full gap-2 md:w-fit">
            <BiMailSend size={20} />
            Enviar por correo
          </Button> */}
            </div>
          </Card>
          {/* resumen de presupuesto */}

          {/* modal crear bonificación intInVehicle */}
          <Dialog open={createBonifModal} onOpenChange={setCreateBonifModal}>
            <DialogContent className="sm:max-w-[425px]">
              <Form {...formCreate}>
                <form onSubmit={formCreate.handleSubmit(onSubmitIntInBonif)}>
                  <DialogHeader>
                    <DialogTitle>Agregar bonificación</DialogTitle>
                  </DialogHeader>
                  <div className="py-7">
                    <div className="w-full mb-3 h-fit">
                      <FormField
                        control={formCreate.control}
                        name="details"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-right">
                              Detalles
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                id="details"
                                placeholder="Ingresar bonificación"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex items-end w-full gap-3 h-fit">
                      <FormField
                        control={formCreate.control}
                        name="addOrSub"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monto</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={"-"}
                            >
                              <FormControl>
                                <SelectTrigger className="flex gap-3">
                                  <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="-">-</SelectItem>
                                <SelectItem value="+">+</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formCreate.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                id="amount"
                                placeholder="25000"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <DialogFooter className="mt-4">
                    <Button type="submit">Añadir bonificación</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          {/* modal crear bonificación intInVehicle */}

          {/* modal crear bonificación leadVehicle */}
          <Dialog
            open={createLeadVehicBonifModal}
            onOpenChange={setCreateLeadVehicBonifModal}
          >
            <DialogContent className="sm:max-w-[425px]">
              <Form {...formCreate}>
                <form
                  onSubmit={formCreate.handleSubmit(onSubmitLeadVehicBonif)}
                >
                  <DialogHeader>
                    <DialogTitle>Agregar bonificación</DialogTitle>
                  </DialogHeader>
                  <div className="py-7">
                    <div className="w-full mb-3 h-fit">
                      <FormField
                        control={formCreate.control}
                        name="details"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-right">
                              Detalles
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                id="details"
                                placeholder="Ingresar bonificación"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex items-end w-full gap-3 h-fit">
                      <FormField
                        control={formCreate.control}
                        name="addOrSub"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monto</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={"-"}
                            >
                              <FormControl>
                                <SelectTrigger className="flex gap-3">
                                  <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="-">-</SelectItem>
                                <SelectItem value="+">+</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formCreate.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                id="amount"
                                placeholder="25000"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <DialogFooter className="mt-4">
                    <Button type="submit">Añadir bonificación</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          {/* modal crear bonificación leadVehicle */}
        </>
      )}
    </>
  );
};

export default CreateBudgetForm;
