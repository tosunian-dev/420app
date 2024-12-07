"use client";
import EmployeesChart from "@/components/admin/dashboard/employees/EmployeesChart";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TiUserAdd } from "react-icons/ti";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formSchema } from "@/app/schemas/createEmployeeForm";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IAdmin } from "@/app/models/admin";

const EmployeesPage = () => {
  const formCreate = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
      phone: "",
      email: "",
      password: "",
      username: "",
    },
  });
  const { toast } = useToast();
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<IAdmin[]>([]);

  async function getEmployees() {
    try {
      const employeesFetch = await fetch("/api/employees", {
        method: "GET",
        cache: "no-store",
      }).then((response) => response.json());
      console.log(employeesFetch);

      setEmployees(employeesFetch.employees);
      setLoading(false);
    } catch (error) {}
  }

  // ADD NEW EMPLOYEE FUNCTION
  async function onSubmit(values: any) {
    console.log(values);
    values.uuid = uuidv4();
    setOpenCreateDialog(false);
    setLoading(true);
    try {
      const newEmployee = await fetch("/api/employees", {
        method: "POST",
        body: JSON.stringify(values),
      }).then((response) => response.json());
      console.log(newEmployee);
      getEmployees();
      setLoading(false);
      toast({ description: "¡Nuevo empleado creado!", variant: "default" });
    } catch (error) {
      setLoading(false);
      toast({ description: "Error al crear empleado", variant: "destructive" });
    }
  }

  useEffect(() => {
    getEmployees();
  }, []);

  return (
    <>
      {/* create employee modal */}
      <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...formCreate}>
            <form onSubmit={formCreate.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Crear empleado</DialogTitle>
                <DialogDescription>
                  Ingresá los datos de tu nuevo empleado.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="w-full h-fit">
                  <FormField
                    control={formCreate.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Nombre</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            id="name"
                            placeholder="Pedro"
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
                    name="surname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Apellido</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            id="surname"
                            placeholder="Lopez"
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
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Nombre de usuario</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            id="username"
                            placeholder="pedrolopez12"
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
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Contraseña</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            id="password"
                            placeholder="*********"
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
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Teléfono</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            id="phone"
                            placeholder="2235423025"
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            id="email"
                            placeholder="pedrolopez@gmail.com"
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
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de usuario</FormLabel>
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
                            <SelectItem value="EMPLOYEE">Vendedor</SelectItem>
                            <SelectItem value="ADMIN">Administrador</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button type="submit">Crear empleado</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {/* create employee modal */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium ">Mis empleados</h2>
        <Button
          onClick={() => setOpenCreateDialog(true)}
          variant="outline"
          className="p-2 w-fit h-fit"
        >
          <TiUserAdd size={20} className="w-fit h-fit" />
        </Button>
      </div>
      <Separator className="my-4" />
      <div>
        <div className="grid gap-0 ">
          {/* EDIT PRODUCT FORM */}
          <EmployeesChart employeesFetch={employees} onCreated={() => getEmployees()} />
        </div>
      </div>
    </>
  );
};

export default EmployeesPage;
