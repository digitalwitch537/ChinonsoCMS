
import * as z from "zod";

export const contactInfoSchema = z.object({
  email: z.string().email("Valid email is required."),
  phone: z.string().min(1, "Phone number is required.").optional().or(z.literal('')),
  address: z.string().min(1, "Address is required.").optional().or(z.literal('')),
  businessHours: z.string().optional().or(z.literal('')),
});

export type ContactInfoValues = z.infer<typeof contactInfoSchema>;

