import { z } from "zod";

export const formSchema = z.object({
  title: z.string({ message: "Ingresá un nombre." }).min(1, {
    message: "Ingresa un nombre.",
  }),
  dateToDo: z.date({
    required_error: "Selecciona una fecha",
    invalid_type_error: "El formato no es una fecha.",
  }),
});
