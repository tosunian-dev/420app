import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-select";
import React from "react";
import { IoMdAdd, IoMdMore } from "react-icons/io";
import LeadsChart from "@/components/admin/dashboard/leads/LeadsChart";
import Link from "next/link";
import QuestionsChart from "@/components/admin/dashboard/questions/QuestionsChart";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Consultas | Panel de administración",
  description:
    "Distrito Automotor, concesionaria de vehículos ubicada en Mar del Plata, Buenos Aires",
};

const LeadsPage = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium ">Consultas</h2>
        {/* <Link href={"/admin/dashboard/leads/create"}>
          <Button variant="outline" className="flex gap-2 p-2 w-fit h-fit">
            <IoMdAdd size={20} className="w-fit h-fit" />
            <span>Crear lead</span>
          </Button>
        </Link> */}
      </div>
      <Separator className="my-4" />
      <div>
        <div className="grid gap-0 ">
          {/* chart with branches data */}
          <QuestionsChart />
        </div>
      </div>
    </>
  );
};

export default LeadsPage;
