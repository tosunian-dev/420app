"use client";
import { useToast } from "@/hooks/use-toast";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { TbPencilDollar } from "react-icons/tb";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IProduct } from "@/interfaces/IProduct";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [openModifyPricesDialog, setOpenModifyPricesDialog] = useState(false);
  const [percent, setPercent] = useState<string | null>(null);
  const [addOrSub, setAddOrSub] = useState<string>("");
  const [itemsSelected, setItemsSelected] = useState<IProduct[]>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  })
  const { toast } = useToast();
  const selectedProducts = table.getFilteredSelectedRowModel().rows;

  // handle selected products
  useEffect(() => {
    console.log(selectedProducts);

    if (selectedProducts.length === 0) setItemsSelected([]);
    if (selectedProducts.length > 0) {
      setItemsSelected((prevItems) => {
        const selProducts: IProduct[] = [];
        selectedProducts.forEach((product: any) => {
          let selectedProduct: IProduct = {
            nombre: '',
            marca: '',
            categoria: '',
            precioAlPublico: 0,
            precioDeLista: 0,
            porcentajeGanancia: 0,
            _id: ''
          }
          selectedProduct.nombre = product.original.nombre
          selectedProduct.marca = product.original.marca
          selectedProduct.categoria = product.original.categoria
          selectedProduct.precioAlPublico = product.original.precioAlPublico
          selectedProduct.precioDeLista = product.original.precioDeLista
          selectedProduct.porcentajeGanancia = product.original.porcentajeGanancia
          selectedProduct._id = product.original._id
          selProducts.push(selectedProduct);
        });
        return selProducts;
      });
    }
  }, [selectedProducts, data]);
  // handle selected products

  useEffect(() => {
    console.log("itemsSelected", itemsSelected);
  }, [itemsSelected]);

  useEffect(() => {
    console.log("percent", percent);
  }, [percent]);

  useEffect(() => {
    console.log("addOrSub", addOrSub);
  }, [addOrSub]);

  async function handlePriceChange() {
    console.log("percent", percent);
    console.log("addOrSub", addOrSub);
  }

  return (
    <>
      <div>
        <div className="flex items-center justify-between w-full pt-1 pb-3">
          <Input
            placeholder="🔎︎  Buscar producto, marca o categoría..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
          {/* <Input
              placeholder="🔎︎  Buscar por categoría..."
              value={
                (table.getColumn("categoria")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("categoria")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            /> */}
          {itemsSelected.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setOpenModifyPricesDialog(!openModifyPricesDialog)}
              className="flex gap-2 p-2 w-fit h-fit"
            >
              <TbPencilDollar size={20} className="w-fit h-fit" />
              <span>Modificar precios</span>
            </Button>
          )}
        </div>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No hay resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end py-4 space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>

      {/* modal modificar precios */}
      <Dialog
        open={openModifyPricesDialog}
        onOpenChange={setOpenModifyPricesDialog}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modificar precios por porcentaje</DialogTitle>
            <DialogDescription>
              Si queres aumentar el precio, seleccioná &quot;Aumentar
              precio&quot; o &quot;Bajar precio&quot; para bajar el precio.
              Luego ingresar el porcentaje a aplicar. El porcentaje se
              aplicará a todos los productos que seleccionaste.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-8 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="">
                Aumentar o bajar precio
              </Label>
              <Select
                onValueChange={(e) => {
                  setAddOrSub(e);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="+">Aumentar precio</SelectItem>
                    <SelectItem value="-">Bajar precio</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="username" className="">
                Porcentaje
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">%</span>
                <Input
                  id="username"
                  type="number"
                  placeholder="Ingresá un porcentaje"
                  onChange={(e) => {
                    setPercent(e.target.value);
                  }}
                  className="col-span-3"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => handlePriceChange()}>
              Modificar precio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* modal modificar precios */}
    </>
  )
}

