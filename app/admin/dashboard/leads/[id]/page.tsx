import { Separator } from "@radix-ui/react-select";
import React from "react";
import LeadInfoForm from "@/components/admin/dashboard/leads/LeadDetails";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Gestionar lead | Panel de administración",
  description:
    "Distrito Automotor, concesionaria de vehículos ubicada en Mar del Plata, Buenos Aires",
};

const CreateLeadPage = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium ">Gestionar lead</h2>
      </div>
      <Separator className="my-4" />
      <div>
        <div className="">
          {/* chart with branches data */}
          <LeadInfoForm />
        </div>
      </div>
    </>
  );
};

export default CreateLeadPage;
