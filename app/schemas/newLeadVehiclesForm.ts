import { z } from "zod";

export const formSchema = z.object({
  leadName: z
    .string({ message: "Ingresá un nombre." })
    .optional()
    .or(z.literal(" ")),
  leadYear: z
    .string({
      message: "Ingresa un año..",
    })
    .optional()
    .or(z.literal(" ")),
  leadKilometers: z.string().optional().or(z.literal(" ")),
  leadMotor: z.string().optional().or(z.literal(" ")),
  leadType: z.string().optional().or(z.literal(" ")),
  leadCurrency: z.string().optional().or(z.literal(" ")),
  leadPrice: z.string().optional().or(z.literal(" ")),
  leadObservations: z.string().optional().or(z.literal(" ")),
});
