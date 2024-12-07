"use client";

import { Camera, Check, ChevronsUpDown } from "lucide-react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { carBrands } from "@/app/utils/carBrands";
import { useEffect, useRef, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { formSchema } from "@/app/schemas/editProductForm";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useRouter, useSearchParams } from "next/navigation";
import { ICar } from "@/app/models/car";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import ImageGallery from "./ImageGallery";
import { CardContent } from "@/components/ui/card";
import React from "react";
import { IBranch } from "@/app/models/branch";

const EditProductForm = ({ uuid }: { uuid: string }) => {
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
      status: "",
      gearbox: "",
      doors: "",
      gas: "",
      description: "",
      show: true,
      imagePath: "",
      branchID: "",
    },
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [vehicleData, setVehicleData] = useState<ICar>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollToDiv = searchParams.get("scrollToDiv");
  const [fileToUpload, setFileToUpload] = useState<File>();
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState<IBranch[]>();
  const [buttonLoading, setButtonLoading] = useState(false);

  async function getVehicleData() {
    try {
      const vehicle = await fetch("/api/cars/" + uuid, {
        method: "GET",
      }).then((response) => response.json());
      if (vehicle) {
        setVehicleData(vehicle);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    } catch (error) {}
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
    getVehicleData();
    getBranches();
  }, []);

  useEffect(() => {
    if (scrollToDiv) {
      const element = document.getElementById(scrollToDiv);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }else {
        
      }
    }
  }, [scrollToDiv]);

  async function handleEdit() {
    setButtonLoading(true);
    try {
      const vehicle = await fetch("/api/cars/" + uuid, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form.getValues()),
      }).then((response) => response.json());
      if (vehicle) {
        setVehicleData(vehicle);
        toast({ description: "¡Vehículo editado!", variant: "default" });
        setButtonLoading(false);
        router.refresh();
      }
    } catch (error) {
      setButtonLoading(false);
      toast({
        description: "Error al editar vehículo",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    if (vehicleData) {
      form.setValue("name", vehicleData!.name);
      form.setValue("modelName", vehicleData!.modelName);
      form.setValue("year", vehicleData!.year.toString());
      form.setValue("brand", vehicleData!.brand);
      form.setValue("kilometers", vehicleData!.kilometers.toString());
      form.setValue("motor", vehicleData!.motor);
      form.setValue("type", vehicleData!.type);
      form.setValue("currency", vehicleData!.currency);
      form.setValue("price", vehicleData!.price.toString());
      form.setValue("status", vehicleData!.status);
      form.setValue("gearbox", vehicleData!.gearbox);
      form.setValue("gas", vehicleData!.gas);
      form.setValue("show", vehicleData!.show);
      form.setValue("description", vehicleData!.description);
      form.setValue("doors", vehicleData!.doors);
      form.setValue("imagePath", vehicleData!.imagePath);
      form.setValue("branchID", vehicleData!.branchID!);
    }
    console.log(form.getValues());
  }, [vehicleData]);

  const handleClick = () => {
    const fileInput = document.querySelector(".inputField") as HTMLElement;
    if (fileInput != null) {
      fileInput.click();
    }
  };

  const handleFileInputRefClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let image;

    if (e.target.files?.length != undefined) {
      image = e.target.files[0];
      if (
        image.type == "image/jpeg" ||
        image.type == "image/png" ||
        image.type == "image/webp" ||
        image.type == "image/jpg"
      ) {
        console.log(image);
        //updateProfileImage(image);
      } else {
      }
    }
  };

  async function uploadImage(file: File) {
    if (!file) return;
    try {
      let formData = new FormData();
      formData.append("gallery_images", file);
      formData.append("carID", uuid as string);

      const uploadResponse = await fetch("/api/gallery/thumbnail", {
        method: "POST",
        body: formData,
      }).then((response) => response.json());
      if (uploadResponse.msg === "THUMBNAIL_UPLOADED") {
        toast({ description: "¡Imagen cambiada!", variant: "default" });
        getVehicleData();
      }
    } catch (error) {
      toast({
        description: "Error al cambiar imagen",
        variant: "destructive",
      });
    }
  }

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEdit)} className="">
            <div className="flex flex-col w-full gap-10 md:flex-row">
              <div className="flex flex-col w-full gap-4 md:w-1/2">
                <span className="text-xl font-semibold">
                  Información general
                </span>
                {/* thumbnail */}
                <div
                  onClick={handleClick}
                  className="w-3/4 mx-auto my-5 rounded-full md:w-3/5 inputFileFormProfile"
                  title="Cambiar logo de empresa"
                >
                  {vehicleData?.imagePath === "" && (
                    <>
                      <CardContent className="py-6">
                        <Button
                          variant="outline"
                          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50"
                          onClick={handleFileInputRefClick}
                          type="button"
                        >
                          <Camera className="w-12 h-12 mb-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Seleccionar miniatura
                          </span>
                        </Button>
                        <Input
                          type="file"
                          className="sr-only"
                          ref={fileInputRef}
                          name="image_file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files![0];
                            console.log(file);
                            uploadImage(file);
                          }}
                        />
                      </CardContent>
                    </>
                  )}
                  {vehicleData?.imagePath !== "" && (
                    <>
                      <Image
                        width={500}
                        height={500}
                        className="w-full rounded-lg "
                        src={vehicleData?.imagePath!}
                        alt=""
                        unoptimized
                      />
                      <input
                        onChange={(e) => {
                          const file = e.target.files![0];
                          console.log(file);
                          uploadImage(file);
                        }}
                        type="file"
                        className="inputField"
                        accept="image/*"
                        hidden
                      />
                    </>
                  )}
                </div>
                {/* product name */}
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
                  {/* currency */}
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem className="w-fit">
                        <FormLabel>Precio</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          {...field}
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

                  {/* price */}
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

                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  {/* brand */}
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem className="w-full">
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
                                      {...field}
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

                  {/* modelName */}
                  <FormField
                    control={form.control}
                    name="modelName"
                    render={({ field }) => (
                      <FormItem className="w-full">
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
                </div>

                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  {/* type */}
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Tipo de vehiculo</FormLabel>
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
                            <SelectItem value="PICKUP">Pickup</SelectItem>
                            <SelectItem value="UTILITARY">
                              Utilitario
                            </SelectItem>
                            <SelectItem value="UTV">UTV</SelectItem>
                            <SelectItem value="ATV">ATV</SelectItem>
                            <SelectItem value="SUV">SUV</SelectItem>
                            <SelectItem value="VAN">Van</SelectItem>
                            <SelectItem value="CONVERTIBLE">
                              Convertible
                            </SelectItem>
                            <SelectItem value="COUPE">Coupe</SelectItem>
                            <SelectItem value="HATCHBACK">Hatchback</SelectItem>
                            <SelectItem value="MOTORHOME">Motorhome</SelectItem>
                            <SelectItem value="SCOOTER">Scooter</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* year */}
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem className="w-full">
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
                </div>
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  {/* kilometers */}
                  <FormField
                    control={form.control}
                    name="kilometers"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Kilometros</FormLabel>
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

                  {/* doors */}
                  <FormField
                    control={form.control}
                    name="doors"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Cantidad de puertas</FormLabel>
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
                {/* description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="w-full ">
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
              </div>
              <div className="hidden w-1/2 md:block">
                <span className="hidden text-xl font-semibold md:block">
                  Galería de imágenes
                </span>

                <ImageGallery />
              </div>
            </div>

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
                        {...field}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MANUAL">Manual</SelectItem>
                          <SelectItem value="AUTOMATIC">Automática</SelectItem>
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
                        {...field}
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
            <Separator className="my-10" />
            <span className="text-xl font-semibold">
              Estado de la publicación
            </span>
            <div className="grid grid-cols-1 gap-4 mt-4 md:gap-8 md:grid-cols-2">
              {/* show product */}
              <FormField
                control={form.control}
                name="show"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Mostar producto
                      </FormLabel>
                      <FormDescription>
                        Podés ocultar tu producto hasta que lo desees sin
                        eliminarlo.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 mt-4 md:gap-8 md:grid-cols-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Estado</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      {...field}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AVAILABLE">Disponible</SelectItem>
                        <SelectItem value="RESERVED">Reservado</SelectItem>
                        <SelectItem value="SOLD">Vendido</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="branchID"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Cambiar sucursal</FormLabel>
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

            {buttonLoading && (
              <>
                <div
                  className="flex items-center justify-center w-full mt-10 overflow-y-hidden bg-white md:w-1/4 dark:bg-background"
                  style={{ zIndex: "99999999", height: "40px" }}
                >
                  <div className=" loaderSmall"></div>
                </div>
              </>
            )}

            {!buttonLoading && (
              <Button type="submit" className="w-full mt-10 md:w-1/4">
                Guardar cambios
              </Button>
            )}
          </form>
        </Form>
      )}
    </>
  );
};

export default EditProductForm;
