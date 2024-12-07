import { z } from "zod";

export const formSchema = z.object({
  observations: z.string({ message: "Ingresa una observación." }).min(1, {
    message: "Ingresa una observación.",
  }),
});
