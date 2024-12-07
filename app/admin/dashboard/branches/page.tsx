"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-select";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import BranchesChart from "@/components/admin/dashboard/branches/BranchesChart";
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

const BranchesPage = () => {
  const formCreate = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      branchName: "",
      address: "",
      city: "",
      state: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);

  // ADD NEW BRANCH FUNCTION
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

  return (
    <>
      <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...formCreate}>
            <form onSubmit={formCreate.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Crear sucursal</DialogTitle>
                <DialogDescription>
                  Ingresá los datos de tu nueva sucursal.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="w-full h-fit">
                  <FormField
                    control={formCreate.control}
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
                    control={formCreate.control}
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
                    control={formCreate.control}
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
                    control={formCreate.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Provincia</FormLabel>
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
              <DialogFooter>
                <Button type="submit">Crear sucursal</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium ">Mis sucursales</h2>
        {/* create branch modal */}
        <Button onClick={() => setOpenCreateDialog(true)} variant="outline" className="p-2 w-fit h-fit">
          <IoMdAdd size={20} className="w-fit h-fit" />
        </Button>

        {/* create branch modal */}
      </div>
      <Separator className="my-4" />
      <div>
        <div className="grid gap-0 ">
          {/* chart with branches data */}
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
          {!loading && <BranchesChart />}
        </div>
      </div>
    </>
  );
};

export default BranchesPage;
