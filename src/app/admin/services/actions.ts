
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { addCollectionItem, updateCollectionItem, deleteCollectionItem } from "@/lib/data-service";
import type { Service } from "@/lib/types";

const serviceSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(3, "Slug must be at least 3 characters.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens.").optional(),
  name: z.string().min(3, "Name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.string().min(1, "Price is required."),
  iconName: z.string().optional(),
  details: z.array(z.string().min(5, "Detail must be at least 5 characters.")).optional(),
});

export async function createServiceAction(values: z.infer<typeof serviceSchema>): Promise<{ success: boolean; error?: string; service?: Service }> {
  const validation = serviceSchema.safeParse(values);
  if (!validation.success) {
    return { success: false, error: JSON.stringify(validation.error.flatten().fieldErrors) };
  }
  try {
    // Decap will handle slug generation for filename. The 'id' field might be explicit or derived.
    const newService = await addCollectionItem<Service>('services', validation.data as Omit<Service, 'id' | 'slug'>);
    revalidatePath("/admin/services"); // For Decap
    revalidatePath("/services");
    revalidatePath("/"); 
    return { success: true, service: newService };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: error.message };
  }
}

export async function updateServiceAction(slugOrId: string, values: z.infer<typeof serviceSchema>): Promise<{ success: boolean; error?: string; service?: Service }> {
   const validation = serviceSchema.safeParse(values);
  if (!validation.success) {
    return { success: false, error: JSON.stringify(validation.error.flatten().fieldErrors) };
  }
  try {
    const updatedService = await updateCollectionItem<Service>('services', slugOrId, validation.data);
    if (!updatedService) return { success: false, error: "Service not found." };
    
    revalidatePath("/admin/services"); // For Decap
    revalidatePath("/services");
    revalidatePath("/");
    return { success: true, service: updatedService };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: error.message };
  }
}

export async function deleteServiceAction(slugOrId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const deleted = await deleteCollectionItem('services', slugOrId);
     if (!deleted) return { success: false, error: "Service not found or already deleted." };

    revalidatePath("/admin/services"); // For Decap
    revalidatePath("/services");
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: error.message };
  }
}
