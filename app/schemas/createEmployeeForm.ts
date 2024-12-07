import { z } from "zod";

export const formSchema = z.object({
  name: z.string({ message: "Ingresá un nombre." }).min(1, {
    message: "Ingresa un nombre de sucursal.",
  }),
  username: z.string({ message: "Ingresá un nombre de usuario." }).min(1, {
    message: "Ingresa un domicilio.",
  }),
  password: z.string({ message: "Ingresá una contraseña." }).min(1, {
    message: "Ingresa una ciudad.",
  }),
  surname: z.string({ message: "Ingresá un apellido." }).min(1, {
    message: "Ingresa una provincia.",
  }),
  phone: z.string({ message: "Ingresá un telefono." }).min(1, {
    message: "Ingresa una provincia.",
  }),
  email: z.string({ message: "Ingresá un correo." }).min(1, {
    message: "Ingresa una provincia.",
  }),
  role: z.string({ message: "Ingresá un rol de usuario." }).min(1, {
    message: "Ingresa una provincia.",
  }),
});
