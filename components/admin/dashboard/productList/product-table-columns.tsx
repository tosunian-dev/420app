"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IProduct } from "@/interfaces/IProduct";

interface ProductTableColumnsProps {
  onEdit: (product: IProduct) => void;
  onDelete: (product: IProduct) => void;
  onCopyPrice: () => void;
}

export const ProductTableColumns = ({
  onEdit,
  onDelete,
  onCopyPrice
}: ProductTableColumnsProps): ColumnDef<IProduct>[] => [
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
          <span
            className="flex items-center p-0 cursor-pointer hover:text-white "
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Producto
            <ArrowUpDown size={14} className="hidden ml-2 md:block" />
          </span>
        );
      },
    },
    {
      accessorKey: "precioDeLista",
      header: ({ column }) => {
        return (
          <span
            className="flex items-center p-0 cursor-pointer hover:text-white "
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Precio de lista
            <ArrowUpDown size={14} className="hidden ml-2 md:block" />
          </span>
        );
      },
      cell: ({ row }) => {
        const precioDeLista = parseFloat(row.getValue("precioDeLista"));
        const formatted = new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
        }).format(precioDeLista);
        return <div className="font-medium text-left">{formatted}</div>;
      },
    },
    {
      accessorKey: "precioAlPublico",
      meta: 'Precio al público',

      header: ({ column }) => {
        return (
          <span
            className="flex items-center p-0 cursor-pointer hover:text-white "
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Precio al público
            <ArrowUpDown size={14} className="hidden ml-2 md:block " />
          </span>
        );
      },
      cell: ({ row }) => {
        const precioAlPublico = parseFloat(row.getValue("precioAlPublico"));
        const formatted = new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
        }).format(precioAlPublico);
        return <div className="font-medium text-left">{formatted}</div>;
      },
    },
    {
      accessorKey: "categoria",
      header: ({ column }) => {
        return (
          <span
            className="flex items-center p-0 cursor-pointer hover:text-white "
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Categoría
            <ArrowUpDown size={14} className="hidden ml-2 md:block" />
          </span>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-8 h-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  onCopyPrice();
                  navigator.clipboard.writeText(product.precioAlPublico.toString())
                }
                }
              >
                Copiar precio al público
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(product)}>
                Editar producto
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(product)}>
                Eliminar producto
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

