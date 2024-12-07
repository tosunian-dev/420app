"use client";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/select";
import { IProduct } from "@/interfaces/IProduct";

//export const metadata: Metadata = {
//  title: "Todos los productos | 420 Constitución",
//};

export const products: IProduct[] = [
  {
    _id: "728ed52f",
    precioAlPublico: 1200,
    precioDeLista: 1000,
    marca: "Namaste",
    categoria: "Fertilizantes",
    nombre: "NAMASTE AMAZONIA (150 GR)",
  },
  {
    _id: "78201HFA",
    precioAlPublico: 4000,
    precioDeLista: 2500,
    marca: "Namaste",
    categoria: "Fertilizantes",
    nombre: "NAMASTE AMAZONIA (500 GR)",
  },
  {
    _id: "123hunjg",
    precioAlPublico: 1500,
    precioDeLista: 670,
    marca: "Namaste",
    categoria: "Fertilizantes",
    nombre: "NAMASTE FLORA BOOSTER (1 LT)",
  },
  {
    _id: "8953lkdnkm2",
    precioAlPublico: 9014,
    precioDeLista: 7080,
    marca: "Namaste",
    categoria: "Fertilizantes",
    nombre: "NAMASTE BIO NEEM (30 ML)",
  },
  {
    _id: "09sakna25",
    precioAlPublico: 4050,
    precioDeLista: 3000,
    marca: "Namaste",
    categoria: "Fertilizantes",
    nombre: "NAMASTE ORO NEGRO (100 ML)",
  },
  // ...
];

export const categoriesList = [
  "Fertilizantes",
  "Sustratos",
  "Macetas",
  "Parafernalia",
  "Fungicidas",
  "Insecticidas",
  "Carpas",
  "Iluminación",
  "Herramientas",
  "Ventilación",
  "Riego",
  "Hidroponia",
  "Medición",
  "Semillas",
  "Instalaciones eléctricas",
  "Otros",
];



const StockList = () => {
  const formCreate = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      categoria: "",
      precioAlPublico: "",
      precioDeLista: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [allProducts, setAllProducts] = useState<IProduct[]>([])

  // GET ALL PRODUCTS
  async function getProducts() {
    try {
      const productsFetch = await fetch("/api/products", {
        method: "GET",
        cache: "no-store",
      });
      const products = await productsFetch.json();
      setLoading(false)
      setAllProducts(products)
    } catch (error) {
      return;
    }
  }

  // ADD NEW BRANCH FUNCTION
  async function onSubmit(values: any) {
    setOpenCreateDialog(false);
    setLoading(true);

    values.marca = ''
    values.porcentajeGanancia = 0

    try {
      await fetch("/api/products", {
        method: "POST",
        body: JSON.stringify(values),
      }).then((response) => response.json());
      setLoading(false);
      toast({ description: `¡Creaste el producto ${values.nombre}!`, variant: "default" });
      getProducts()
    } catch (error) {
      setLoading(false);
      toast({ description: "Error al crear producto", variant: "destructive" });
    }
  }

  useEffect(() => {
    getProducts()
  }, [])

  return (
    <>

      <div className="flex items-center justify-between px-2 sm:px-4 ">
        <h2 className="text-xl font-medium md:text-2xl ">Mis productos</h2>
        <Button
          variant="outline"
          onClick={() => setOpenCreateDialog(!openCreateDialog)}
          className="flex gap-2 p-2 w-fit h-fit"
        >
          <IoMdAdd size={20} className="w-fit h-fit" />
          <span>Crear producto</span>
        </Button>
      </div>
      <Separator className="my-5"></Separator>

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
          <DataTable columns={columns} data={allProducts} />
        </>
      )}
      {/* <CarList cars={cars} /> */}

      {/* modal crear producto */}
      <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...formCreate}>
            <form onSubmit={formCreate.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Crear producto</DialogTitle>
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
      {/* modal crear producto */}
    </>
  );
};

export default StockList;
