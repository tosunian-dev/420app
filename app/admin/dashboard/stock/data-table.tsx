"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formSchema } from "@/app/schemas/createProductForm";
import { useToast } from "@/hooks/use-toast";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
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
  DialogTrigger,
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
import { categoriesList } from "./page";
import { IProduct } from "@/interfaces/IProduct";

export interface DataTableProps<TData extends DataTableItem, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}
export type DataTableItem = Record<string, unknown>

export function DataTable<TData extends DataTableItem, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [loading, setLoading] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [itemsSelected, setItemsSelected] = useState<IProduct[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openModifyPricesDialog, setOpenModifyPricesDialog] = useState(false);
  const [percent, setPercent] = useState<string | null>(null);
  const [addOrSub, setAddOrSub] = useState<string>("");
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase()
      return Object.values(row.original).some(
        value =>
          typeof value === 'string' &&
          value.toLowerCase().includes(search)
      )
    },
  });

  const formCreate = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      categoria: "",
      precioAlPublico: "",
      precioDeLista: "",
    },
  });
  const { toast } = useToast();
  const selectedProducts = table.getFilteredSelectedRowModel().rows;

  const selectedProductsIndexes = table.getState().rowSelection;
  const productListPaginated = table.getPaginationRowModel().rows;
  //console.log(productListPaginated);
  const test3 = table.getState();
  //console.log(test3);



  // EDIT PRODUCT FUNCTION
  async function onSubmit(values: any) {
    setOpenCreateDialog(false);
    setLoading(true);
    try {
      const newBranch = await fetch("/api/branches", {
        method: "POST",
        body: JSON.stringify(values),
      }).then((response) => response.json());
      setLoading(false);
      toast({ description: "¡Nueva sucursal creada!", variant: "default" });
    } catch (error) {
      setLoading(false);
      toast({ description: "Error al crear sucursal", variant: "destructive" });
    }
  }

  // handle selected products
  useEffect(() => {
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
      {loading && (
        <>
          <div
            className="flex items-center justify-center w-full overflow-y-hidden bg-white dark:bg-background"
            style={{ zIndex: "99999999", height: "50vh" }}
          >
            <div className=" loader"></div>
          </div>
        </>
      )}
      {!loading && (
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
                  onClick={() => setOpenModifyPricesDialog(!openCreateDialog)}
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
                        );
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
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}

                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No hay resultados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex flex-col items-center justify-end gap-6 py-4 mx-auto mt-2 w-fit">
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} de{" "}
                {table.getFilteredRowModel().rows.length} productos seleccionados.
              </div>
              <div className="flex gap-2 w-fit">
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
          </div>
        </>
      )}
      {/* modal crear producto not in use */}
      <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...formCreate}>
            <form onSubmit={formCreate.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Crear productoo</DialogTitle>
                <DialogDescription>
                  Ingresá los datos de tu nuevo producto.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="w-full h-fit">
                  <FormField
                    control={formCreate.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">
                          Nombre del producto
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            id="branchName"
                            placeholder="Ej. BIOBIZZ CALMAG (500 ML)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full h-fit">
                  <FormField
                    control={formCreate.control}
                    name="categoria"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categoriesList.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full h-fit">
                  <FormField
                    control={formCreate.control}
                    name="precioDeLista"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">
                          Precio de lista
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center w-full">
                            <span className="text-sm font-semibold w-14">ARS $</span>
                            <Input
                              id="precioDeLista"
                              type="number"
                              className="w-full"
                              placeholder="Ingresa el precio de lista"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-full h-fit">
                  <FormField
                    control={formCreate.control}
                    name="precioAlPublico"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">
                          Precio al público
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center w-full">
                            <span className="text-sm font-semibold w-14">ARS $</span>
                            <Input
                              id="precioAlPublico"
                              type="number"
                              placeholder="Ingresa el precio al público"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogFooter className="mt-2">
                <Button type="submit">Crear producto</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {/* modal crear producto not in use */}
    </>
  );
}
