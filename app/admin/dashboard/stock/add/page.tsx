import { Separator } from "@/components/ui/separator";
import AddProductForm from "@/components/admin/dashboard/addProduct/AddProductForm";
const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
const ACCEPTED_FILE_TYPES = ["image/png"];
import React from "react";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Agregar vehículo | Panel de administración",
  description:
    "Distrito Automotor, concesionaria de vehículos ubicada en Mar del Plata, Buenos Aires",
};
const AddProduct = () => {
  return (
    <>
      <h2 className="text-2xl font-medium ">Agregar vehículo</h2>
      <Separator className="my-4" />
      <div>
        <div className="grid gap-0 ">
          {/* EDIT PRODUCT FORM */}
          <AddProductForm />
        </div>
      </div>
    </>
  );
};

export default AddProduct;
