import { z } from "zod";

export const formSchema = z.object({
  name: z.string({ message: "Ingrese un nombre." }).min(1, {
    message: "Ingrese un nombre.",
  }),
  surname: z
    .string({
      message: "Ingrese un apellido..",
    })
    .min(4, {
      message: "Ingrese un apellido.",
    }),
  details: z.string().min(1, {
    message: "Ingrese una consulta.",
  }),
  phone: z.string().min(1, {
    message: "Ingrese un teléfono.",
  }),
  email: z
    .string()
    .min(1, { message: "Ingrese un correo" })
    .email("Ingrese un correo válido."),
});
