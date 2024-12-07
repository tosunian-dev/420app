"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/app/css-modules/budget/budget.module.css";
import logo from "@/public/dalogoblack.png";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FaPhoneAlt, FaUserAlt, FaUserTie } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { ICar } from "@/app/models/car";
import { ILeadVehicle } from "@/app/models/leadvehicles";
import { IBonif } from "./CreateBudgetForm";
import { IoLocationSharp } from "react-icons/io5";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { ILead } from "@/app/models/lead";
import { useSession } from "next-auth/react";
import { FiDownload } from "react-icons/fi";
import dayjs from "dayjs";
import { useToast } from "@/hooks/use-toast";

interface props {
  intInVehicle: ICar | undefined;
  intInVehicleBonifs: IBonif[];
  intInVehicleBonifsSubtotal: number;
  leadVehicles: ILeadVehicle | undefined;
  total: number;
  currency: string;
  transfer: number;
  lead: ILead | undefined;
}

const Budget = ({
  intInVehicle,
  intInVehicleBonifs,
  intInVehicleBonifsSubtotal,
  leadVehicles,
  total,
  transfer,
  currency,
  lead,
}: props) => {
  const budgetRef = useRef<HTMLDivElement>(null);
  const [budgetNumber, setBudgetNumber] = useState<number>(0);
  const [leadData, setLeadData] = useState<ILead>();
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session }: any = useSession();
  console.log(session);
  const { toast } = useToast();

  function createRandomFiveDigits() {
    return Math.floor(10000 + Math.random() * 90000);
  }
  useEffect(() => {
    setBudgetNumber(createRandomFiveDigits());
  }, []);

  async function generatePDF() {
    const data = budgetRef.current;
    setLoading(true);
    try {
      if (data) {
        const canvas = await html2canvas(data, {
          scale: 2,
        });
        const img = canvas.toDataURL("image/png");

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: "a4",
        });

        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;

        pdf.addImage(img, "PNG", 0, 0, width, height);
        const as = pdf.save(
          `Presupuesto-${budgetNumber}-${lead?.name}_${lead?.surname}.pdf`
        );
        console.log(as);

        const budgetData = {
          leadID: lead?._id,
          budgetNumber: budgetNumber,
          businessType: lead?.businessType,
          dateOfIssue: new Date(),
          sellerName: session.user.name + " " + session.user.surname,
          sellerPhone: session.user.phone,
          sellerEmail: session.user.email,
          clientName: lead?.name + " " + lead?.surname,
          clientPhone: lead?.phone,
          clientEmail: lead?.email,
          vehicleName: intInVehicle?.name,
          vehicleType: intInVehicle?.type,
          vehicleYear: intInVehicle?.year,
          vehicleMotor: intInVehicle?.motor,
          vehicleDoors: intInVehicle?.doors,
          vehiclePrice: intInVehicle?.price,
          vehicleGas: intInVehicle?.gas,
          vehicleKilometers: intInVehicle?.kilometers,
          vehicleGearbox: intInVehicle?.gearbox,
          clientVehicleName: leadVehicles?.leadName,
          clientVehiclePrice: leadVehicles?.leadPrice,
          clientVehicleYear: leadVehicles?.leadYear,
          clientVehicleKilometers: leadVehicles?.leadKilometers,
          clientVehicleMotor: leadVehicles?.leadMotor,
          budgetCurrency: intInVehicle?.currency,
          bonifsSubtotal: intInVehicleBonifsSubtotal,
          transfer: transfer.toFixed(2),
          total: total,
        };

        const dataToSave = { bonifs: intInVehicleBonifs, budgetData };

        try {
          const savedBudget = await fetch("/api/budgets", {
            method: "POST",
            body: JSON.stringify(dataToSave),
          }).then((response) => response.json());
          console.log(savedBudget);
          toast({ description: "¡Presupuesto creado!", variant: "default" });
          setLoading(false);
        } catch (error) {
          console.log("error save budget");
          toast({
            description: "Error al guardar presupusto",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        description: "Error al crear presupuesto",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    setLeadData(lead);
  }, [lead]);

  return (
    <>
      <div
        ref={budgetRef}
        className={`${styles.page} sr-only overflow-hidden px-8 text-black`}
      >
        {/* header */}
        <div className="flex items-center justify-between text-black h-28">
          <div className="h-fit w-fit">
            <Image src={logo} width={200} alt="Distrito Automotor" />
          </div>
          <div className="flex flex-col items-start w-fit h-fit justify-self-center">
            <span className="text-lg font-medium text-black uppercase">
              Presupuesto
            </span>
            <span className="text-sm font-normal text-gray-600">
              N° {budgetNumber}
            </span>
          </div>
          <div className="flex gap-8">
            <div className="flex flex-col ">
              <span className="text-xs font-semibold">Tipo de negocio</span>
              <span className="text-xs font-light">{lead?.businessType}</span>
            </div>
            <div className="flex flex-col ">
              <span className="text-xs font-semibold">Fecha </span>
              <span className="text-xs font-light">
                {dayjs().format("DD/MM/YYYY")}
              </span>
            </div>
          </div>
        </div>

        {/* seller and client info */}
        <div>
          <Card
            style={{ borderColor: "rgb(228, 228, 231)" }}
            className="flex flex-col w-full bg-white h-fit border-border"
          >
            <div className="flex">
              {/* seller */}
              <div className="flex flex-col justify-between w-1/2 gap-3 p-4 text-black">
                <span
                  style={{ lineHeight: "13px" }}
                  className="text-sm font-semibold"
                >
                  Vendedor
                </span>
                <div className="flex flex-col flex-wrap w-full gap-1">
                  <div className="flex flex-row justify-between">
                    <span
                      style={{ fontSize: "11px" }}
                      className="flex items-center gap-1.5 font-light"
                    >
                      <FaUserTie /> {session?.user.name} {session?.user.surname}
                    </span>
                    <span
                      style={{ fontSize: "11px" }}
                      className="flex items-center gap-1.5 font-light"
                    >
                      <FaPhoneAlt /> {session?.user.phone}
                    </span>
                  </div>
                  <div className="w-fit h-fit">
                    <span
                      style={{ fontSize: "11px" }}
                      className="flex items-center gap-1.5 font-light"
                    >
                      <IoIosMail />
                      {session?.user.email}
                    </span>
                  </div>
                </div>
              </div>
              {/* seller */}

              <Separator
                style={{ backgroundColor: "rgb(228, 228, 231, 80%)" }}
                className="h-[50px] mx-1 my-auto "
                orientation="vertical"
              />

              {/* client */}
              <div className="flex flex-col justify-between w-1/2 gap-3 p-4 text-black">
                <span
                  style={{ lineHeight: "13px" }}
                  className="text-sm font-semibold"
                >
                  Cliente
                </span>
                <div className="flex flex-col flex-wrap w-full gap-1">
                  <div className="flex flex-row justify-between">
                    <span
                      style={{ fontSize: "11px" }}
                      className="flex items-center gap-1.5 font-light"
                    >
                      <FaUserAlt />
                      {lead?.name} {lead?.surname}
                    </span>
                    <span
                      style={{ fontSize: "11px" }}
                      className="flex items-center gap-1.5 font-light"
                    >
                      <FaPhoneAlt />
                      {lead?.phone}
                    </span>
                  </div>
                  <div className="w-fit h-fit">
                    <span
                      style={{ fontSize: "11px" }}
                      className="flex items-center gap-1.5 font-light"
                    >
                      <IoIosMail />
                      {lead?.email}
                    </span>
                  </div>
                </div>
              </div>
              {/* client */}
            </div>
            <Separator
              style={{ backgroundColor: "rgb(228, 228, 231, 80%)" }}
              className="w-full mb-2 "
              orientation="horizontal"
            />
            <div className="flex gap-2 pt-1 pb-3 pl-4 font-light text-black h-fit">
              <IoLocationSharp className="my-auto" size={16} />
              <span style={{ fontSize: "11px" }} className="my-auto">
                Sucursal Juan B. Justo 2040, Buenos Aires, Mar del plata.
              </span>
            </div>
          </Card>
        </div>

        {/* vehicles and budget details */}
        <div className="flex w-full h-full gap-8 mt-3">
          {/* vehicles' details */}
          <div className="flex flex-col gap-5 w-1/2 h-fit">
            <Card
              style={{ borderColor: "rgb(228, 228, 231)" }}
              className="flex w-full h-full p-5 bg-white border-border"
            >
              <div className="flex flex-col w-full gap-0">
                <span
                  style={{ fontSize: "15px" }}
                  className="font-semibold text-black "
                >
                  Vehículo a comprar
                </span>

                <Separator
                  className="px-5 mx-auto my-4 "
                  style={{ backgroundColor: "rgb(228, 228, 231, 100%)" }}
                  orientation="horizontal"
                />
                <div className="flex flex-col ">
                  <div className="flex flex-col text-black">
                    <span className="text-xs font-semibold ">Vehículo</span>
                    <span className="text-xs text-gray-400">
                      {intInVehicle?.name}
                    </span>
                  </div>

                  <Separator
                    className="px-5 mx-auto my-2 "
                    style={{ backgroundColor: "rgb(228, 228, 231, 100%)" }}
                    orientation="horizontal"
                  />

                  <div className="flex flex-col text-black">
                    <span className="text-xs font-semibold ">
                      Tipo de vehículo
                    </span>
                    <span className="text-xs text-gray-400">
                      {intInVehicle?.type === "CAR" && "Automóvil"}
                      {intInVehicle?.type === "BIKE" && "Motocicleta"}
                      {intInVehicle?.type === "QUAD" && "Cuatriciclo"}
                      {intInVehicle?.type === "UTV" && "UTV"}
                    </span>
                  </div>

                  <Separator
                    className="px-5 mx-auto my-2 "
                    style={{ backgroundColor: "rgb(228, 228, 231, 100%)" }}
                    orientation="horizontal"
                  />

                  <div className="flex flex-col text-black">
                    <span className="text-xs font-semibold ">
                      Año de fabricación
                    </span>
                    <span className="text-xs text-gray-400">
                      {intInVehicle?.year}
                    </span>
                  </div>

                  <Separator
                    className="px-5 mx-auto my-2 "
                    style={{ backgroundColor: "rgb(228, 228, 231, 100%)" }}
                    orientation="horizontal"
                  />

                  <div className="flex flex-col text-black">
                    <span className="text-xs font-semibold ">Kilometraje</span>
                    <span className="text-xs text-gray-400">
                      {intInVehicle?.kilometers}
                    </span>
                  </div>

                  <Separator
                    className="px-5 mx-auto my-2 "
                    style={{ backgroundColor: "rgb(228, 228, 231, 100%)" }}
                    orientation="horizontal"
                  />

                  <div className="flex flex-col text-black">
                    <span className="text-xs font-semibold ">Motorizacíon</span>
                    <span className="text-xs text-gray-400">
                      {intInVehicle?.motor}
                    </span>
                  </div>

                  <Separator
                    className="px-5 mx-auto my-2 "
                    style={{ backgroundColor: "rgb(228, 228, 231, 100%)" }}
                    orientation="horizontal"
                  />

                  <div className="flex flex-col text-black">
                    <span className="text-xs font-semibold ">
                      Cantidad de puertas
                    </span>
                    <span className="text-xs text-gray-400">
                      {intInVehicle?.doors === "2P" && "2 puertas"}
                      {intInVehicle?.doors === "3P" && "3 puertas"}
                      {intInVehicle?.doors === "4P" && "4 puertas"}
                      {intInVehicle?.doors === "5P" && "5 puertas"}
                    </span>
                  </div>

                  <Separator
                    className="px-5 mx-auto my-2 "
                    style={{ backgroundColor: "rgb(228, 228, 231, 100%)" }}
                    orientation="horizontal"
                  />

                  <div className="flex flex-col text-black">
                    <span className="text-xs font-semibold ">Combustible</span>
                    <span className="text-xs text-gray-400 ">
                      {intInVehicle?.gas === "DIESEL" && "Diésel"}
                      {intInVehicle?.gas === "GNC" && "GNC"}
                      {intInVehicle?.gas === "NAFTA" && "Nafta"}
                    </span>
                  </div>

                  <Separator
                    className="px-5 mx-auto my-2 "
                    style={{ backgroundColor: "rgb(228, 228, 231, 100%)" }}
                    orientation="horizontal"
                  />

                  <div className="flex flex-col text-black">
                    <span className="text-xs font-semibold ">Transmisión</span>
                    <span className="text-xs text-gray-400">
                      {intInVehicle?.gearbox === "AUTOMATIC" && "Automática"}
                      {intInVehicle?.gearbox === "MANUAL" && "Manual"}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {leadVehicles?.leadName !== "" && (
              <Card
                style={{ borderColor: "rgb(228, 228, 231)" }}
                className="flex w-full h-full p-5 bg-white border-border"
              >
                <div className="flex flex-col w-full gap-0">
                  <span
                    style={{ fontSize: "15px" }}
                    className="font-semibold text-black "
                  >
                    Vehículo usado
                  </span>

                  <Separator
                    className="px-5 mx-auto my-4 "
                    style={{ backgroundColor: "rgb(228, 228, 231, 100%)" }}
                    orientation="horizontal"
                  />
                  <div className="flex flex-col ">
                    <div className="flex flex-col text-black">
                      <span className="text-xs font-semibold ">Vehículo</span>
                      <span className="text-xs text-gray-400">
                        {leadVehicles?.leadName}
                      </span>
                    </div>

                    <Separator
                      className="px-5 mx-auto my-2 "
                      style={{ backgroundColor: "rgb(228, 228, 231, 100%)" }}
                      orientation="horizontal"
                    />

                    <div className="flex flex-col text-black">
                      <span className="text-xs font-semibold ">
                        Año de fabricación
                      </span>
                      <span className="text-xs text-gray-400">
                        {leadVehicles?.leadYear}
                      </span>
                    </div>

                    <Separator
                      className="px-5 mx-auto my-2 "
                      style={{ backgroundColor: "rgb(228, 228, 231, 100%)" }}
                      orientation="horizontal"
                    />
                    <div className="flex flex-col text-black">
                      <span className="text-xs font-semibold ">
                        Kilometraje
                      </span>
                      <span className="text-xs text-gray-400">
                        {leadVehicles?.leadKilometers}
                      </span>

                      <Separator
                        className="px-5 mx-auto my-2 "
                        style={{ backgroundColor: "rgb(228, 228, 231, 100%)" }}
                        orientation="horizontal"
                      />
                      <div className="flex flex-col text-black">
                        <span className="text-xs font-semibold ">
                          Motorizacíon
                        </span>
                        <span className="text-xs text-gray-400">
                          {leadVehicles?.leadMotor}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* resumen de presupuesto */}
          <Card
            style={{ borderColor: "rgb(228, 228, 231)" }}
            className=" p-5 bg-white h-fit w-1/2"
          >
            <div className="flex flex-col gap-0 text-black bg-white">
              <span
                style={{ fontSize: "15px" }}
                className="font-semibold text-black"
              >
                Resumen
              </span>

              <Separator
                className="my-4 "
                style={{ backgroundColor: "rgb(228, 228, 231, 100%)" }}
                orientation="horizontal"
              />
              <div>
                {/* precio del vehiculo */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between w-full">
                    <span className="text-xs font-semibold">
                      Precio del vehículo
                    </span>
                    <span className="text-xs font-semibold">
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
                    <Separator
                      className="my-5 "
                      style={{ backgroundColor: "rgb(228, 228, 231, 100%)" }}
                      orientation="horizontal"
                    />
                    <div className="flex flex-col mt-5">
                      <span className="mb-3 text-xs font-semibold ">
                        Bonificaciones
                      </span>
                      {/* <Separator className="my-1" orientation="horizontal" /> */}
                      <div className="flex flex-col gap-2">
                        {intInVehicleBonifs.map((bonif) => (
                          <>
                            <div className="flex items-start justify-between w-full">
                              <span className="text-xs font-normal text-gray-400">
                                {bonif.details}
                              </span>
                              <span className="text-xs text-gray-400 ">
                                {bonif.addOrSub} {currency} $
                                {bonif.amount.toLocaleString()}{" "}
                              </span>
                            </div>
                          </>
                        ))}
                      </div>
                      <div className="flex items-start justify-between w-full mt-2">
                        <span className="text-xs font-semibold">
                          Subtot. de bonificaciones
                        </span>
                        <span className="text-xs font-semibold">
                          {Number(intInVehicleBonifsSubtotal.toLocaleString()) <
                          0
                            ? "-"
                            : ""}{" "}
                          {currency} $
                          {Number(intInVehicleBonifsSubtotal.toLocaleString()) <
                          0
                            ? Number(
                                intInVehicleBonifsSubtotal.toLocaleString()
                              ) * -1
                            : Number(
                                intInVehicleBonifsSubtotal.toLocaleString()
                              )}
                        </span>
                      </div>
                    </div>
                  </>
                )}
                {/* bonificaciones */}

                <Separator
                  className="my-5 "
                  style={{ backgroundColor: "rgb(228, 228, 231, 100%)" }}
                  orientation="horizontal"
                />

                {/* entrega de usado */}
                {leadVehicles?.leadName !== "" && (
                  <>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between w-full">
                        <span className="text-xs font-semibold">
                          Entrega de vehículo
                        </span>
                        <span className="text-xs font-semibold">
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

                <Separator
                  className="my-5 "
                  style={{ backgroundColor: "rgb(228, 228, 231, 100%)" }}
                  orientation="horizontal"
                />

                {/* costos de transferencia */}
                <div className="flex items-start justify-between w-full">
                  <span className="text-xs font-semibold">
                    Costos de transferencia
                  </span>
                  <span className="text-xs font-semibold">
                    {currency} ${transfer.toFixed(2).toLocaleString()}
                  </span>
                </div>
                {/* costos de transferencia */}

                <Separator
                  className="my-5 "
                  style={{ backgroundColor: "rgb(228, 228, 231, 100%)" }}
                  orientation="horizontal"
                />

                {/* total a pagar */}
                <div className="flex items-start justify-between w-full">
                  <span className="text-sm font-semibold underline">
                    Total a pagar
                  </span>
                  <span className="text-sm font-semibold underline">
                    {currency} ${Number(total.toFixed(2)).toLocaleString()}
                  </span>
                </div>
                {/* total a pagar */}
              </div>
            </div>
          </Card>

          {/* resumen de presupuesto */}
        </div>

        {/* <div className="flex flex-col gap-4">
          <span className="text-xs font-normal text-black">-Este presupuesto es una estimación y está sujeto a cambios sin previo
          aviso.</span>
        </div> */}
      </div>
      {loading && (
        <>
          <div
            className="flex items-center justify-center w-full my-5 overflow-y-hidden bg-white dark:bg-background"
            style={{ zIndex: "99999999", height: "40px" }}
          >
            <div className=" loaderSmall"></div>
          </div>
        </>
      )}
      {!loading && (
        <>
          <Button onClick={generatePDF} className="w-full gap-2 my-5 md:w-fit">
            <FiDownload size={20} />
            Guardar como PDF
          </Button>
        </>
      )}
      {/* <Button onClick={generatePDF}>Guardar</Button> */}
    </>
  );
};

export default Budget;
