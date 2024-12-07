import { z } from "zod";

export const formSchema = z.object({
  details: z.string({ message: "Ingresa un detalle." }).min(1, {
    message: "Ingresa un detalle." ,
  }),
  amount: z.string({ message: "Ingresa un monto." }).min(1, {
    message: "Ingresa un monto.",
  }),
  addOrSub: z.string({ message: "Ingresa una observación." }).min(1, {
    message: "Ingresa una observación.",
  }),
});
