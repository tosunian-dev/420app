"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IProduct } from "@/interfaces/IProduct";
import { categoriesList } from "@/app/utils/categoriesList";

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  categoria: z.string().min(1, "La categoría es requerida"),
  precioDeLista: z.string().min(1, "El precio de lista es requerido"),
  precioAlPublico: z.string().min(1, "El precio al público es requerido"),
  marca: z.string().optional(),
});

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Partial<IProduct>, isEditing: boolean) => Promise<void>;
  editingProduct: IProduct | null;
}

export function ProductDialog({
  open,
  onOpenChange,
  onSubmit,
  editingProduct,
}: ProductDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      categoria: "",
      precioDeLista: "",
      precioAlPublico: "",
      marca: "",
    },
  });

  useEffect(() => {
    if (editingProduct) {
      form.reset({
        nombre: editingProduct.nombre,
        categoria: editingProduct.categoria,
        precioDeLista: editingProduct.precioDeLista.toString(),
        precioAlPublico: editingProduct.precioAlPublico.toString(),
        marca: editingProduct.marca || "",
      });
    } else {
      form.reset({
        nombre: "",
        categoria: "",
        precioDeLista: "",
        precioAlPublico: "",
        marca: "",
      });
    }
  }, [editingProduct, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('valores', values);

    await onSubmit(
      {
        ...values,
        precioDeLista: parseFloat(values.precioDeLista),
        precioAlPublico: parseFloat(values.precioAlPublico),
        _id: editingProduct?._id,
      },
      !!editingProduct,

    );
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader className="mb-2">
              <DialogTitle className="text-left">
                {editingProduct ? "Editar producto" : "Crear producto"}
              </DialogTitle>
              <DialogDescription className="text-left">
                {editingProduct
                  ? "Modifica los datos del producto."
                  : "Ingresá los datos de tu nuevo producto."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 ">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del producto</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej. BIOBIZZ CALMAG (500 ML)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
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
              <FormField
                control={form.control}
                name="precioDeLista"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio de lista</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <span className="mr-2 text-sm font-semibold w-14">
                          ARS $
                        </span>
                        <Input
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
              <FormField
                control={form.control}
                name="precioAlPublico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio al público</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <span className="mr-2 text-sm font-semibold w-14">
                          ARS $
                        </span>
                        <Input
                          type="number"
                          className="w-full"
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
            <DialogFooter className="mt-4">
              <Button type="submit">
                {editingProduct ? "Guardar cambios" : "Crear producto"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

