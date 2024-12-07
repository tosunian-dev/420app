"use client";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { carBrands } from "@/app/utils/carBrands";
import { useEffect, useRef, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { formSchema } from "@/app/schemas/addProductForm";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ICar } from "@/app/models/car";
import React from "react";
import { IBranch } from "@/app/models/branch";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

const AddProductForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      year: "",
      brand: "",
      kilometers: "",
      motor: "",
      type: "",
      currency: "ARS",
      price: "",
      modelName: "",
      gearbox: "",
      doors: "",
      gas: "",
      description: "",
      branchID: "",
    },
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [createdVehicle, setCreatedVehicle] = useState<ICar>();
  const modalButtonRef = useRef<HTMLButtonElement>(null);
  const [branches, setBranches] = useState<IBranch[]>();
  const [openCreated, setOpenCreated] = useState(false);
  const { toast } = useToast();

  function handleGalleryRedirect() {
    if (createdVehicle) {
      //router.push(
      //  `/admin/dashboard/stock/${createdVehicle.uuid}?scrollToDiv=galleryCont`
      //);
      router.push(`/admin/dashboard/stock/${createdVehicle.uuid}`);
      router.refresh();
    }
  }

  // ADD NEW PRODUCT FUNCTION
  async function onSubmit(values: any) {
    setLoading(true);
    values.uuid = uuidv4();
    try {
      const vehicle = await fetch("/api/cars", {
        method: "POST",
        body: JSON.stringify(values),
      }).then((response) => response.json());
      setOpenCreated(true);
      setCreatedVehicle(vehicle);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        description: "Error al crear vehículo",
        variant: "destructive",
      });
    }
  }

  async function getBranches() {
    try {
      const branchesFetch = await fetch("/api/branches", {
        method: "GET",
        cache: "no-cache",
      }).then((response) => response.json());
      setBranches(branchesFetch.branches);
    } catch (error) {}
  }

  useEffect(() => {
    getBranches();
  }, []);

  return (
    <>
      {loading && (
        <>
          <div
            className="flex items-center justify-center w-full overflow-y-hidden bg-white dark:bg-background"
            style={{ zIndex: "99999999", height: "67vh" }}
          >
            <div className=" loader"></div>
          </div>
        </>
      )}

      {!loading && (
        <>
          <Form {...form}>
            <span className="text-xl font-semibold">Información general</span>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-4 mt-6 md:gap-10 md:grid-cols-2">
                {/* product name */}
                <div className="flex flex-col gap-4 md:gap-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de la publicación</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej. Chevrolet Cruze LTZ 1.4T"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex col-span-2 gap-2">
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem className="w-fit">
                          <FormLabel>Precio</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ARS">ARS</SelectItem>
                              <SelectItem value="USD">USD</SelectItem>
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="opacity-0">-</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ingresa un precio"
                              type="number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* modelname and kilometers */}
                  <div className="grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="kilometers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kilómetros</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ingresa un kilometraje"
                              type="number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="doors"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cantidad de puertas</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="2P">2 puertas</SelectItem>
                              <SelectItem value="3P">3 puertas</SelectItem>
                              <SelectItem value="4P">4 puertas</SelectItem>
                              <SelectItem value="5P">5 puertas</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                {/* year and brand */}
                <div className="grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marca</FormLabel>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className="justify-between w-full"
                              >
                                {field.value
                                  ? carBrands.find(
                                      (brand) => brand === field.value
                                    )
                                  : "Seleccionar"}
                                <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Buscar marca..." />
                              <CommandList>
                                <CommandEmpty>No hay resultados.</CommandEmpty>
                                <CommandGroup>
                                  {carBrands.map((brand) => (
                                    <CommandItem
                                      key={brand}
                                      value={brand}
                                      className="capitalize"
                                      onSelect={() => {
                                        console.log(brand);
                                        setOpen(false);
                                        form.setValue("brand", brand);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value === brand
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {brand}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="modelName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modelo</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej. Cruze"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de vehículo</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CAR">Automóvil</SelectItem>
                            <SelectItem value="BIKE">Motocicleta</SelectItem>
                            <SelectItem value="QUAD">Cuatriciclo</SelectItem>
                            <SelectItem value="UTV">UTV</SelectItem>
                            <SelectItem value="PICKUP">Pickup</SelectItem>
                            <SelectItem value="UTILITARY">
                              Utilitario
                            </SelectItem>
                            <SelectItem value="SUV">SUV</SelectItem>
                            <SelectItem value="VAN">Van</SelectItem>
                            <SelectItem value="CONVERTIBLE">
                              Convertible
                            </SelectItem>
                            <SelectItem value="COUPE">Coupe</SelectItem>
                            <SelectItem value="HATCHBACK">Hatchback</SelectItem>
                            <SelectItem value="MOTORHOME">Motorhome</SelectItem>
                            <SelectItem value="ATV">ATV</SelectItem>
                            <SelectItem value="SCOOTER">Scooter</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Año de fabricación</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej. 2021"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="branchID"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Sucursal</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {branches?.map((branch) => (
                              <SelectItem key={branch._id} value={branch._id!}>
                                {branch.address}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full pr-0 mt-4 md:mt-8 md:w-1/2 md:pr-5 ">
                    <FormLabel>
                      Descripción <span className="">(opcional)</span>
                    </FormLabel>
                    <Textarea
                      {...field}
                      placeholder="Ingresa una descripción"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator className="my-10" />
              <span className="text-xl font-semibold">Motorización</span>
              <div className="grid grid-cols-1 gap-4 mt-4 md:gap-10 md:grid-cols-2">
                {/* motor and gearbox */}
                <div className="grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="motor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Motor</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej. 2.0 TSI"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gearbox"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transmisión</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MANUAL">Manual</SelectItem>
                            <SelectItem value="AUTOMATIC">
                              Automática
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="gas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Combustible</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="NAFTA">Nafta</SelectItem>
                            <SelectItem value="DIESEL">Diesel</SelectItem>
                            <SelectItem value="GNC">GNC</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full mt-12 mb-5 md:w-1/3">
                Crear vehículo
              </Button>

              <div className="px-10 rounded-md">
                <AlertDialog open={openCreated}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¡Vehículo creado!</AlertDialogTitle>
                      <AlertDialogDescription>
                        Hacé click en continuar para agregar fotos a la galería
                        del vehículo.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
                      <AlertDialogAction onClick={handleGalleryRedirect}>
                        Continuar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </form>
          </Form>
        </>
      )}
    </>
  );
};

export default AddProductForm;
