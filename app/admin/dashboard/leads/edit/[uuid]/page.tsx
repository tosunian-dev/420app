import { Separator } from "@radix-ui/react-select";
import React from "react";
import LeadEditForm from "@/components/admin/dashboard/leads/LeadEditInfo";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Editar lead | Panel de administración",
  description:
    "Distrito Automotor, concesionaria de vehículos ubicada en Mar del Plata, Buenos Aires",
};

const CreateLeadPage = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium ">Editar lead</h2>
      </div>
      <Separator className="my-4" />
      <div>
        <div className="grid gap-0 ">
          {/* chart with branches data */}
          <LeadEditForm />
        </div>
      </div>
    </>
  );
};

export default CreateLeadPage;
