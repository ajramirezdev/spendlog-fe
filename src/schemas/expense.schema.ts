import { EXPENSE_TAGS } from "@/types/expenseTagTypes";
import { z } from "zod";

export const expenseSchema = z.object({
  amount: z
    .string()
    .trim()
    .nonempty({ message: "Required." })
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Must be a valid number > than 0.",
    }),

  tags: z
    .array(z.enum(EXPENSE_TAGS))
    .min(1)
    .nonempty({ message: "Tags must contain at least one tag." }),

  date: z.string().nonempty({ message: "Date is required." }),

  description: z.string().optional(),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;
