"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IoMdMore } from "react-icons/io";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formSchema } from "@/app/schemas/editEmployeeForm";
import { useToast } from "@/hooks/use-toast";
import { IAdmin } from "@/app/models/admin";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSession } from "next-auth/react";

interface props {
  onCreated: () => void;
  employeesFetch: IAdmin[];
}

const EmployeesChart = ({ onCreated, employeesFetch }: props) => {
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<IAdmin>();
  const [loading, setLoading] = useState<boolean>(true);
  const [employees, setEmployees] = useState<IAdmin[]>([]);
  const { data: session }: any = useSession();
  const modalButtonRef = useRef<HTMLButtonElement>(null);
  const handleClick = () => {
    modalButtonRef.current?.click();
  };
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
      phone: "",
      email: "",
      password: "",
      role: "",
    },
  });

  // edit/delete employee
  async function onSubmit(values: any) {
    setLoading(true);
    setOpenEditDialog(false);
    values._id = employeeToEdit?._id;
    if (values.password === "") delete values.password;
    try {
      const edited = await fetch("/api/employees", {
        method: "PUT",
        body: JSON.stringify(values),
      }).then((response) => response.json());
      console.log(edited);
      onCreated();
      setOpenEditDialog(false);
      setLoading(false);
      toast({ description: "¡Empleado editado!", variant: "default" });
    } catch (error) {
      setOpenEditDialog(false);
      setLoading(false);
      toast({
        description: "Error al editar empleado",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    setEmployees(employeesFetch);
    setLoading(false);
  }, [employeesFetch]);

  async function onDelete() {
    setLoading(true);
    setOpenEditDialog(false);
    try {
      await fetch("/api/employees", {
        method: "DELETE",
        body: JSON.stringify(employeeToEdit?._id),
      });
      toast({ description: "¡Empleado eliminado!", variant: "default" });
      onCreated();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        description: "Error al eliminar empleado",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    form.setValue("name", employeeToEdit?.name!);
    form.setValue("surname", employeeToEdit?.surname!);
    form.setValue("phone", employeeToEdit?.phone!);
    form.setValue("email", employeeToEdit?.email!);
    form.setValue("password", employeeToEdit?.password!);
    form.setValue("role", employeeToEdit?.role!);
  }, [employeeToEdit]);

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
          <Table>
            <TableCaption>Listado de empleados.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Nombre y apellido</TableHead>
                <TableHead>Tipo de usuario</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees &&
                employees.map((employee) => (
                  <>
                    <TableRow>
                      <TableCell className="font-medium">
                        {employee.name} {employee.surname}
                      </TableCell>
                      <TableCell>
                        {employee.role === "ADMIN"
                          ? "Administrador"
                          : "Vendedor"}{" "}
                      </TableCell>
                      <TableCell className="text-right">
                        {/* edit */}
                        <Button
                          onClick={() => {
                            setEmployeeToEdit(employee);
                            setOpenEditDialog(true);
                          }}
                          variant="outline"
                          className="p-2 w-fit h-fit"
                        >
                          <IoMdMore size={20} className="w-fit h-fit" />
                        </Button>
                        {/* edit */}
                      </TableCell>
                    </TableRow>
                  </>
                ))}
            </TableBody>
          </Table>

          <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <DialogHeader>
                    <DialogTitle>Editar empleado</DialogTitle>
                    <DialogDescription>
                      Modificá los datos de tu empleado.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {/* name */}
                    <div className="w-full h-fit">
                      <FormField
                        control={form.control}
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
                    {/* surname */}
                    <div className="w-full h-fit">
                      <FormField
                        control={form.control}
                        name="surname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-right">
                              Apellido
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                id="name"
                                placeholder="Lopez"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* phone */}
                    <div className="w-full h-fit">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-right">
                              Telefono
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                id="telefono"
                                placeholder="2235423025"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* email */}
                    <div className="w-full h-fit">
                      <FormField
                        control={form.control}
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
                    {/* password */}
                    <div className="w-full h-fit">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-right">
                              Cambiar contraseña
                            </FormLabel>
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
                    {/* role */}
                    {session?.user &&
                      session?.user.username !== employeeToEdit?.username && (
                        <>
                          <div className="w-full h-fit">
                            <FormField
                              control={form.control}
                              name="role"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Tipo de usuario</FormLabel>
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
                                      <SelectItem value="EMPLOYEE">
                                        Vendedor
                                      </SelectItem>
                                      <SelectItem value="ADMIN">
                                        Administrador
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </>
                      )}
                  </div>

                  <DialogFooter className="gap-6 mt-4">
                    {session?.user.username &&
                      session?.user.username !== employeeToEdit?.username && (
                        <Button
                          onClick={handleClick}
                          type="button"
                          variant={"destructive"}
                        >
                          Eliminar empleado
                        </Button>
                      )}
                    <Button type="submit">Guardar cambios</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* delete employee confirmation modal */}
          <div className="px-10 rounded-md">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="sr-only"
                  ref={modalButtonRef}
                  variant="outline"
                >
                  Show Dialog
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Eliminar empleado</AlertDialogTitle>
                  <AlertDialogDescription>
                    Estás seguro que querés eliminar tu empleado{" "}
                    {/* {branchToDelete?.branchName}? */}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="text-white bg-red-900"
                    onClick={onDelete}
                  >
                    Continuar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          {/* delete employee confirmation modal */}
        </>
      )}
    </>
  );
};

export default EmployeesChart;
