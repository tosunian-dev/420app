import { Separator } from "@/components/ui/separator";
import ImageGallery from "@/components/admin/dashboard/editProduct/ImageGallery";
import EditProductForm from "@/components/admin/dashboard/editProduct/EditProductForm";
const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
const ACCEPTED_FILE_TYPES = ["image/png"];
import React from "react";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Editar vehículo | Panel de administración",
  description:
    "Distrito Automotor, concesionaria de vehículos ubicada en Mar del Plata, Buenos Aires",
};

const EditProduct = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <h2 className="text-2xl font-medium ">Editar vehículo</h2>
      <Separator className="my-4" />
      <div>
        <div className="grid gap-0 ">
          {/* EDIT PRODUCT FORM */}
          <EditProductForm uuid={params.id} />

          <div className="block md:hidden">
            <Separator className="my-10 " />

            {/* GALLERY CAROUSEL */}
            <ImageGallery />
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProduct;
