import { Separator } from "@radix-ui/react-select";
import React from "react";
import CreateBudgetForm from "@/components/admin/dashboard/budgets/CreateBudgetForm";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Crear presupuesto | Panel de administración",
  description:
    "Distrito Automotor, concesionaria de vehículos ubicada en Mar del Plata, Buenos Aires",
};
const CreateBudgetPage = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium ">Crear presupuesto</h2>
      </div>
      <Separator className="my-4" />
      <div>
        <div className="">
          {/* chart with branches data */}
          <CreateBudgetForm/>
        </div>
      </div>
    </>
  );
};

export default CreateBudgetPage;
