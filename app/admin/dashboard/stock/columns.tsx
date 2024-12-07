"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";// This type is used to define the shape of our data.
import { categoriesList } from "./page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { IProduct } from "@/interfaces/IProduct";
import { useToast } from "@/hooks/use-toast";



//let productToEdit: IProduct = {
//  nombre: '',
//  precioAlPublico: 0,
//  precioDeLista: 0,
//  _id: '',
//  categoria: '',
//  marca: ''
//}
//let openCreateDialog = true
//
//async function onEdit(editedProduct: IProduct) {
//  console.log(editedProduct)
//  productToEdit = editedProduct
//}


export const columns: ColumnDef<IProduct>[] = [

  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "nombre",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Producto
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </div >
      );
    },
  },
  {
    accessorKey: "categoria",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Categoría
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </div >
      );
    },
  },
  {
    accessorKey: "precioDeLista",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Precio de lista
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </div>
      )
    },
    cell: ({ row }) => {
      const precioDeLista = parseFloat(row.getValue("precioDeLista"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "ARS",
      }).format(precioDeLista);

      return <div className="font-medium text-left">{formatted}</div>;
    },
  },
  {
    accessorKey: "precioAlPublico",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Precio al público
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </div>
      )
    },
    cell: ({ row }) => {
      const precioAlPublico = parseFloat(row.getValue("precioAlPublico"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "ARS",
      }).format(precioAlPublico);

      return <div className="font-medium text-left">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-8 h-8 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(
                    product.precioAlPublico.toString()
                  )
                }
              >
                Copiar precio al público
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
              }}>Editar producto</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>



        </>
      );
    },
  },
];



{/* modal crear producto */ }
{/* <Dialog onOpenChange={() => { openCreateDialog = false }}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Crear producto</DialogTitle>
                <DialogDescription>
                  Ingresá los datos de tu nuevo producto.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="w-full h-fit">
                  <Label className="text-right">
                    Nombre del producto
                  </Label>
                  <Input
                    type="text"
                    defaultValue={productToEdit.nombre}
                    id="branchName"
                    placeholder="Ej. BIOBIZZ CALMAG (500 ML)"
                  />
                </div>
                <div className="w-full h-fit">

                  <Select
                    //onValueChange={ }
                    defaultValue={productToEdit.categoria}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesList.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full h-fit">
                  <Label className="text-right">
                    Precio de lista
                  </Label>
                  <div className="flex items-center w-full">
                    <span className="text-sm font-semibold w-14">ARS $</span>
                    <Input
                      defaultValue={productToEdit.precioDeLista}
                      id="precioDeLista"
                      type="number"
                      className="w-full"
                      placeholder="Ingresa el precio de lista"
                    />
                  </div>
                </div>

                <div className="w-full h-fit">
                  <Label className="text-right">
                    Precio al público
                  </Label>
                  <Input
                    id="precioAlPublico"
                    type="number"
                    defaultValue={productToEdit.categoria}
                    placeholder="Ingresa el precio al público"
                  />
                </div>
              </div>
              <DialogFooter className="mt-2">
                <Button type="submit">Crear producto</Button>
              </DialogFooter>
            </DialogContent >
          </Dialog > */}
{/* modal crear producto */ }