import { z } from "zod";

export const formSchema = z.object({
  name: z.string({ message: "Ingresá un nombre." }).min(1, {
    message: "Ingresa un nombre.",
  }),
  surname: z
    .string({
      message: "Ingresa un año..",
    })
    .min(4, {
      message: "Ingresa un año.",
    }),
  contactType: z.string().min(1, {
    message: "Selecciona una marca.",
  }),
  businessType: z.string().min(1, {
    message: "Ingresa un tipo de negocio.",
  }),
  address: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  observations: z.string().optional().or(z.literal("")),
  phone: z.string().min(1, {
    message: "Ingresá un teléfono.",
  }),
  employeeID: z.string().min(1, {
    message: "Selecciona un vendedor.",
  }),
  branchID: z.string().min(1, {
    message: "Selecciona una ciudad.",
  }),
  email: z
    .string()
    .min(1, { message: "Ingresa un correo" })
    .email("Ingresa un correo válido."),
});
