import { z } from "zod";

export const formSchema = z.object({
  name: z.string({ message: "Ingresá un nombre." }).min(1, {
    message: "Ingresa un nombre.",
  }),
  password: z.string().optional().or(z.literal("")),
  surname: z.string({ message: "Ingresá un apellido." }).min(1, {
    message: "Ingresa un apellido.",
  }),
  phone: z.string({ message: "Ingresá un telefono." }).min(1, {
    message: "Ingresa un telefono.",
  }),
  email: z.string({ message: "Ingresá un correo." }).min(1, {
    message: "Ingresa un correo.",
  }),
  role: z.string({ message: "Ingresá un rol de usuario." }).min(1, {
    message: "Ingresa un rol de usuario.",
  }),
});
