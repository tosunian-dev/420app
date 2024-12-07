"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { formSchema } from "@/app/schemas/createLeadForm";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ICar } from "@/app/models/car";
import { Button } from "@/components/ui/button";
import React from "react";
import { IAdmin } from "@/app/models/admin";
import { IBranch } from "@/app/models/branch";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ILead } from "@/app/models/lead";
import { useSession } from "next-auth/react";

interface props {
  onChangeFormStep: () => void;
  onChangeFormLastStep: () => void;
  onSaveNewLeadData: (data: ILead) => void;
}

const NewLeadForm = ({
  onChangeFormStep,
  onChangeFormLastStep,
  onSaveNewLeadData,
}: props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
      contactType: "",
      businessType: "",
      address: "",
      observations: "",
      phone: "",
      city: "",
      state: "",
      branchID: "",
      employeeID: "",
    },
  });

  const { data: session }: any = useSession();
  const [vehicleList, setVehicleList] = useState<ICar[]>([]);
  const [employees, setEmployees] = useState<IAdmin[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [branches, setBranches] = useState<IBranch[]>([]);
  const { toast } = useToast();
  const modalButtonRef = useRef<HTMLButtonElement>(null);
  const handleClick = () => {
    modalButtonRef.current?.click();
  };
  console.log(session.user);

  async function getEmployees() {
    try {
      const employeesFetch = await fetch("/api/employees", {
        method: "GET",
        cache: "no-store",
      }).then((response) => response.json());
      console.log(employeesFetch);
      setEmployees(employeesFetch.employees);
      if (session?.user?.role && session?.user?.role !== "ADMIN") {
        form.setValue("branchID", session?.user?._id);
      }
    } catch (error) {}
  }

  async function getBranches() {
    try {
      const branchesFetch = await fetch("/api/branches", {
        method: "GET",
        cache: "no-store",
      }).then((response) => response.json());
      setBranches(branchesFetch.branches);
    } catch (error) {}
  }

  // save lead vehicles function
  async function onSubmit(values: any) {
    console.log(values);
    values.interestedIn = "No especificado";
    values.status = "Pendiente";
    values.pendingTask = "Crear tarea";
    setLoading(true);
    try {
      const leadCreated = await fetch("/api/leads", {
        method: "POST",
        body: JSON.stringify(values),
      }).then((response) => response.json());
      handleClick();
      console.log(leadCreated);
      onSaveNewLeadData(leadCreated.newLead);
      toast({ description: "¡Lead creado!", variant: "default" });
      setLoading(false);
    } catch (error) {
      toast({ description: "Error al crear lead", variant: "destructive" });
      setLoading(false);
      // error alert
    }
  }

  useEffect(() => {
    console.log(vehicleList);
  }, [vehicleList]);

  useEffect(() => {
    getEmployees();
    getBranches();
  }, []);

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
          <Form {...form}>
            <span className="text-xl font-semibold">Datos personales</span>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-4 mt-6 md:gap-10 md:grid-cols-2">
                {/* left column */}
                <div className="grid grid-cols-1 gap-4 h-fit md:gap-8 md:grid-cols-2">
                  {/* name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <FormLabel>Nombre </FormLabel>
                        <FormControl>
                          <Input placeholder="Juan" type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* surname */}
                  <FormField
                    control={form.control}
                    name="surname"
                    render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <FormLabel>Apellido</FormLabel>
                        <FormControl>
                          <Input placeholder="Perez" type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* contacttype */}
                  <FormField
                    control={form.control}
                    name="contactType"
                    render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <FormLabel>Tipo de contacto</FormLabel>
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
                            <SelectItem value="Presencial">
                              Presencial
                            </SelectItem>
                            <SelectItem value="Whatsapp">
                              Whatsapp entrante
                            </SelectItem>
                            <SelectItem value="Mercado Libre">
                              Mercado Libre
                            </SelectItem>
                            <SelectItem value="Facebook">Facebook</SelectItem>
                            <SelectItem value="Instagram">Instagram</SelectItem>
                            <SelectItem value="Llamada">Llamada</SelectItem>
                            <SelectItem value="Referido">Referido</SelectItem>
                            <SelectItem value="Otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* businesstype */}
                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <FormLabel>Tipo de negocio</FormLabel>
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
                            <SelectItem value="Usado por usado">
                              Usado por usado
                            </SelectItem>
                            <SelectItem value="Compra de usado">
                              Compra de usado
                            </SelectItem>
                            <SelectItem value="0km">0km</SelectItem>
                            <SelectItem value="Plan de ahorro">
                              Plan de ahorro
                            </SelectItem>
                            <SelectItem value="Posventa">Posventa</SelectItem>
                            <SelectItem value="Otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* observations */}
                  <FormField
                    control={form.control}
                    name="observations"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>
                          Observaciones <span className="">(opcional)</span>
                        </FormLabel>
                        <Textarea
                          {...field}
                          placeholder="Ingresa tus observaciones"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* right column */}
                <div className="grid grid-cols-1 gap-4 h-fit md:gap-8 md:grid-cols-2">
                  {/* phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="2235405608"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="juanperez@gmail.com"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* address */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel>
                          Domicilio{" "}
                          <span className="text-xs text-gray-500">
                            (opcional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Juan B. Justo 4050"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* city */}
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel>Ciudad{" "}
                          <span className="text-xs text-gray-500">
                            (opcional)
                          </span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Mar del Plata"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* state */}
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel>Provincia{" "}
                          <span className="text-xs text-gray-500">
                            (opcional)
                          </span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Buenos Aires"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <Separator className="my-10" />
                {session?.user?.role && session?.user?.role === "ADMIN" && (
                  <>
                    <span className="text-xl font-semibold">
                      Asignar vendedor
                    </span>
                  </>
                )}
                {session?.user?.role && session?.user?.role !== "ADMIN" && (
                  <>
                    <span className="text-xl font-semibold">
                      Seleccionar sucursal
                    </span>
                  </>
                )}
                {/* asign seller */}
                <div className="grid grid-cols-1 gap-4 mt-6 md:gap-10 md:grid-cols-2">
                  <div className="grid grid-cols-1 gap-4 h-fit md:gap-8 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="branchID"
                      render={({ field }) => (
                        <FormItem className="col-span-2 md:col-span-1">
                          <FormLabel>Sucursal</FormLabel>
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
                              {branches &&
                                branches.map((branch) => (
                                  <SelectItem
                                    key={branch._id}
                                    value={branch._id!}
                                  >
                                    {branch.branchName} - {branch.address}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {session?.user?.role && session?.user?.role === "ADMIN" && (
                      <>
                        <FormField
                          control={form.control}
                          name="employeeID"
                          render={({ field }) => (
                            <FormItem className="col-span-2 md:col-span-1">
                              <FormLabel>Vendedor</FormLabel>
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
                                  {employees &&
                                    employees.map((employee) => (
                                      <SelectItem
                                        key={employee._id}
                                        value={employee._id!}
                                      >
                                        {employee.name} {employee.surname}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full mt-12 mb-5 md:w-1/3">
                Crear lead
              </Button>
            </form>
          </Form>
        </>
      )}

      <div className="px-10 rounded-md">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="sr-only" ref={modalButtonRef} variant="outline">
              Show Dialog
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¡Lead creado!</AlertDialogTitle>
              <AlertDialogDescription>
                Hacé click en continuar para agregar el vehículo de interés del
                lead y agregar el vehículo del lead si es el caso.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={onChangeFormLastStep}>
                Agregar luego
              </AlertDialogCancel>
              <AlertDialogAction onClick={onChangeFormStep}>
                Continuar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default NewLeadForm;
