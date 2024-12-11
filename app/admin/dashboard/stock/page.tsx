"use client";
import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { IProduct } from "@/interfaces/IProduct";
import { ProductTable } from "@/components/admin/dashboard/productList/product-table";
import { ProductDialog } from "@/components/admin/dashboard/productList/product-dialog";
import { ProductDeleteDialog } from "@/components/admin/dashboard/productList/product-delete-dialog";
import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
const ProductsPage = () => {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<IProduct | null>(null);

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/products", {
        method: "GET",
        cache: "no-store",
      });
      const products = await response.json();
      setAllProducts(products);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  //crear / editar / eliminar producto
  const handleProductSubmit = async (values: Partial<IProduct>, isEditing: boolean, isDeleting: boolean) => {
    setOpenDialog(false);
    setOpenDeleteDialog(false);
    setLoading(true);

    const url = isEditing || isDeleting ? `/api/products/${values._id}` : "/api/products";
    const method = isDeleting ? "DELETE" : isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const respon = await response.json()

      if (!response.ok) {
        throw new Error("Failed to submit product");
      }

      await getProducts();
      toast({
        description: isDeleting
          ? `¡Eliminaste el producto ${values.nombre}!`
          : isEditing
            ? `¡Actualizaste el producto ${values.nombre}!`
            : `¡Creaste el producto ${values.nombre}!`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error submitting product:", error);
      toast({
        description: isDeleting
          ? "Error al eliminar producto"
          : isEditing
            ? "Error al actualizar producto"
            : "Error al crear producto",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setEditingProduct(null);
      setDeletingProduct(null);
    }
  };

  const handleEditProduct = (product: IProduct) => {
    setEditingProduct(product);
    setOpenDialog(true);
  };

  const handleDeleteProduct = (product: IProduct) => {
    setDeletingProduct(product);
    setOpenDeleteDialog(true);
  };

  useEffect(() => {
    getProducts();
  }, []);

  function handleSetOpenDialog() {
    setOpenDialog(false); setEditingProduct(null)
  }

  function handleSetOpenDeleteDialog() {
    setOpenDeleteDialog(false); setDeletingProduct(null)
  }

  function handleCopyPrice() {
    toast({
      description: 'Precio copiado al portapapeles',
      variant: "default",
    });
  }

  return (
    <>
      <div className="flex items-start justify-between mb-4 ">
        <div className="flex flex-col gap-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink className="text-xs">
                  <Link href="/admin/dashboard/stock">Inicio</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink className="text-xs">
                  <Link className="text-xs" href="/admin/dashboard/stock">Productos</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-xs">Todos los productos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h2 className="text-xl font-semibold md:text-xl 2xl:text-2xl">Todos los productos</h2>
        </div>
        <Button
          variant="default"
          onClick={() => setOpenDialog(true)}
          className="flex gap-2 p-2 my-auto w-fit h-fit"
        >
          <IoMdAdd size={18} className="w-fit h-fit" />
          <span className="hidden text-xs 2xl:text-sm sm:block">Crear producto</span>
        </Button>
      </div>
      {/* <Separator className="my-5" /> */}

      {loading ? (
        <div
          className="flex items-center justify-center w-full overflow-y-hidden bg-white dark:bg-background"
          style={{ zIndex: "99999999", height: "50vh" }}
        >
          <div className="loader"></div>
        </div>
      ) : (
        <ProductTable data={allProducts} onModifyPrices={() => getProducts()} onEdit={handleEditProduct} onDelete={handleDeleteProduct} onCopyPrice={() => handleCopyPrice()} />
      )}

      <ProductDialog
        open={openDialog}
        onOpenChange={handleSetOpenDialog}
        onSubmit={(values) => handleProductSubmit(values, !!editingProduct, false)}
        editingProduct={editingProduct}
      />
      <ProductDeleteDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onSubmit={(values) => handleProductSubmit(values, false, true)}
        deletingProduct={deletingProduct}
      />
    </>
  );
};

export default ProductsPage;

