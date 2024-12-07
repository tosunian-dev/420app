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
import { IBranch } from "@/app/models/branch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formSchema } from "@/app/schemas/createBranchForm";
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

const BranchesChart = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      branchName: "",
      address: "",
      city: "",
      state: "",
    },
  });
  const [branchToDelete, setBranchToDelete] = useState<IBranch>();
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const modalButtonRef = useRef<HTMLButtonElement>(null);
  const handleClick = () => {
    modalButtonRef.current?.click();
  };
  const { toast } = useToast();

  async function getBranches() {
    try {
      const branchesFetch = await fetch("/api/branches", {
        method: "GET",
        cache: "no-store",
      }).then((response) => response.json());
      setBranches(branchesFetch.branches);
      setLoading(false);
    } catch (error) {}
  }

  async function onDelete() {
    setLoading(true);
    setOpenEditDialog(false)
    try {
      await fetch("/api/branches", {
        method: "DELETE",
        body: JSON.stringify(branchToDelete?._id),
      });
      toast({ description: "Sucursal eliminada", variant: "default" });
      getBranches();
    } catch (error) {
      setLoading(false);
      toast({
        description: "Error al eliminar sucursal ",
        variant: "destructive",
      });
    }
  }

  // EDIT BRANCH FUNCTION
  async function onSubmit(values: any) {
    setLoading(true);

    values._id = branchToDelete?._id;
    try {
      await fetch("/api/branches", {
        method: "PUT",
        body: JSON.stringify(values),
      }).then((response) => response.json());
      getBranches();
      setOpenEditDialog(false);
      setLoading(false);
      toast({ description: "¡Sucursal editada!", variant: "default" });
    } catch (error) {
      setOpenEditDialog(false);
      toast({
        description: "Error al editar sucursal",
        variant: "destructive",
      });
    }
  }
  useEffect(() => {
    getBranches();
  }, []);

  useEffect(() => {
    form.setValue("branchName", branchToDelete?.branchName!);
    form.setValue("address", branchToDelete?.address!);
    form.setValue("city", branchToDelete?.city!);
    form.setValue("state", branchToDelete?.state!);
  }, [branchToDelete]);

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
            <TableCaption>Listado de sucursales.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="md:w-[300px] w-fit">
                  Nombre de sucursal
                </TableHead>
                <TableHead>Domicilio</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches &&
                branches.map((branch) => (
                  <>
                    <TableRow key={branch._id}>
                      <TableCell className="font-medium">
                        {branch.branchName}
                      </TableCell>
                      <TableCell>{branch.address}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => {
                            setBranchToDelete(branch);
                            setOpenEditDialog(true);
                          }}
                          variant="outline"
                          className="p-2 w-fit h-fit"
                        >
                          <IoMdMore size={20} className="w-fit h-fit" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </>
                ))}
            </TableBody>
          </Table>

          {/* edit dialog */}
          <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <DialogHeader>
                    <DialogTitle>Editar sucursal</DialogTitle>
                    <DialogDescription>
                      Modificá los datos de tu sucursal.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="w-full h-fit">
                      <FormField
                        control={form.control}
                        name="branchName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-right">
                              Nombre de sucursal
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                id="branchName"
                                placeholder="Sucursal 1"
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
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-right">
                              Domicilio de sucursal
                            </FormLabel>
                            <FormControl>
                              <Input
                                id="address"
                                type="text"
                                placeholder="Juan B. Justo 2040"
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
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-right">Ciudad</FormLabel>
                            <FormControl>
                              <Input
                                id="city"
                                type="text"
                                placeholder="Mar del Plata"
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
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-right">
                              Provincia
                            </FormLabel>
                            <FormControl>
                              <Input
                                id="state"
                                type="text"
                                placeholder="Buenos Aires"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <DialogFooter className="gap-6 mt-4">
                    <Button
                      onClick={handleClick}
                      type="button"
                      variant={"destructive"}
                    >
                      Eliminar sucursal
                    </Button>
                    <Button type="submit">Guardar cambios</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          {/* edit dialog */}
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
              <AlertDialogTitle>Eliminar sucursal</AlertDialogTitle>
              <AlertDialogDescription>
                Estás seguro que querés eliminar la sucursal{" "}
                {branchToDelete?.branchName}?
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
    </>
  );
};

export default BranchesChart;
