"use client";
import { ILead } from "@/app/models/lead";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect } from "react";
import { LuPartyPopper } from "react-icons/lu";

interface props {
  createdLeadData: ILead | undefined;
}

const NewLeadEnd = ({ createdLeadData }: props) => {
  useEffect(() => {
    console.log(createdLeadData);
  }, [createdLeadData]);

  return (
    <>
      <div className="w-full h-fit py-40 md:py-20 flex flex-col gap-3 justify-center items-center">
        <LuPartyPopper size={60} />
        <h5 className="text-lg font-semibold text-center md:text-xl">
          ¡Lead creado correctamente!
        </h5>
        <span className="opacity-45 text-center text-sm font-extralight md:text-sm">
          ¡Hacé click en el boton debajo para comenzar a gestionar las tareas de
          tu nuevo lead!
        </span>
        <Link href={`/admin/dashboard/leads/${createdLeadData?._id}`}>
          <Button className="mt-4">Crear nueva tarea</Button>
        </Link>
      </div>
    </>
  );
};

export default NewLeadEnd;
