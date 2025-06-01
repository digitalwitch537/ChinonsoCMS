
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { addCollectionItem, updateCollectionItem, deleteCollectionItem } from "@/lib/data-service";
import type { Project } from "@/lib/types";

const projectSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(3, "Slug must be at least 3 characters.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens.").optional(),
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  imageUrl: z.string().url("Must be a valid URL if provided as source.").optional().or(z.literal('')),
  imageDataUri: z.string().optional().or(z.literal('')),
  client: z.string().optional().or(z.literal('')),
  dateCompleted: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format.")
    .optional()
    .or(z.literal('')),
  technologies: z.array(z.string().min(1, "Technology name cannot be empty.")).optional(),
  liveLink: z.string().url("Must be a valid URL if provided.").or(z.literal('')).optional(),
}).refine(data => {
    if (data.imageUrl && data.imageDataUri) return false; 
    return true;
}, { message: "Provide either an Image URL or an Uploaded Image, not both.", path: ["imageUrl"] });


export async function createProjectAction(values: z.infer<typeof projectSchema>): Promise<{ success: boolean; error?: string; project?: Project }> {
  const validation = projectSchema.safeParse(values);
  if (!validation.success) {
    return { success: false, error: JSON.stringify(validation.error.flatten().fieldErrors) };
  }
  
  let dataToSave = { ...validation.data };
  if (dataToSave.imageDataUri) {
    dataToSave.imageUrl = ""; 
  }

  try {
    const newProject = await addCollectionItem<Project>('projects', dataToSave as Omit<Project, 'id' | 'slug'>);
    revalidatePath("/admin/portfolio"); // For Decap
    revalidatePath("/portfolio");
    revalidatePath("/"); 
    return { success: true, project: newProject };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: error.message };
  }
}

export async function updateProjectAction(slugOrId: string, values: z.infer<typeof projectSchema>): Promise<{ success: boolean; error?: string; project?: Project }> {
   const validation = projectSchema.safeParse(values);
  if (!validation.success) {
    return { success: false, error: JSON.stringify(validation.error.flatten().fieldErrors) };
  }

  let dataToSave = { ...validation.data };
  if (dataToSave.imageDataUri) {
    dataToSave.imageUrl = ""; 
  }
  
  try {
    const updatedProject = await updateCollectionItem<Project>('projects', slugOrId, dataToSave);
    if (!updatedProject) return { success: false, error: "Project not found." };
    
    revalidatePath("/admin/portfolio"); // For Decap
    revalidatePath("/portfolio");
    revalidatePath("/");
    return { success: true, project: updatedProject };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: error.message };
  }
}

export async function deleteProjectAction(slugOrId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const deleted = await deleteCollectionItem('projects', slugOrId);
    if (!deleted) return { success: false, error: "Project not found or already deleted." };
    
    revalidatePath("/admin/portfolio"); // For Decap
    revalidatePath("/portfolio");
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: error.message };
  }
}
