import { z } from "zod";

export const formSchema = z.object({
  branchName: z.string({ message: "Ingresá un nombre." }).min(1, {
    message: "Ingresa un nombre de sucursal.",
  }),
  address: z.string({ message: "Ingresá un nombre." }).min(1, {
    message: "Ingresa un domicilio.",
  }),
  city: z.string({ message: "Ingresá un nombre." }).min(1, {
    message: "Ingresa una ciudad.",
  }),
  state: z.string({ message: "Ingresá un nombre." }).min(1, {
    message: "Ingresa una provincia.",
  }),
});
