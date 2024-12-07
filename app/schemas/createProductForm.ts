import { z } from "zod";

export const formSchema = z.object({
  nombre: z.string().min(1, {
    message: "Ingresa un nombre.",
  }),
  categoria: z.string().min(1, {
    message: "Selecciona una categoría.",
  }),
  precioAlPublico: z.string().min(1, {
    message: "Ingresa un precio al público.",
  }),
  precioDeLista: z.string().min(1, {
    message: "Ingresa un precio de lista.",
  }),
});
