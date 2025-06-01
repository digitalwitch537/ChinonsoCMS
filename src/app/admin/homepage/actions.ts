
"use server";

import { revalidatePath } from "next/cache";
import { updateHomepageContent as updateData, getHomepageContent as getData } from "@/lib/data-service";
import type { HomepageContent } from "@/lib/types";
import { homepageContentSchema, type HomepageContentValues } from "./homepageContentSchema"; 

export async function updateHomepageContentAction(
  values: HomepageContentValues
): Promise<{ success: boolean; error?: string; data?: HomepageContent }> {
  const validation = homepageContentSchema.safeParse(values);
  if (!validation.success) {
    const errorMessages = validation.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('; ');
    return { success: false, error: errorMessages };
  }

  let dataToSave = { ...validation.data };
  if (dataToSave.imageDataUri) {
    dataToSave.professionalPhotoUrl = ""; 
  }
  // Ensure bio is passed, even if empty string
  dataToSave.bio = dataToSave.bio || "";


  try {
    await updateData(dataToSave as HomepageContent);
    revalidatePath("/admin/homepage"); // For Decap
    revalidatePath("/"); 
    return { success: true, data: dataToSave as HomepageContent };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: error.message };
  }
}

export async function getHomepageContentAction(): Promise<HomepageContent> {
    try {
        const data = await getData();
        return {
            professionalPhotoUrl: data.professionalPhotoUrl || "",
            imageDataUri: data.imageDataUri || "",
            bio: data.bio || "Default bio text if not set." // Ensure bio always has a value
        };
    } catch (e) {
        console.error("Failed to load homepage content:", e);
        return { bio: "Error loading bio.", professionalPhotoUrl: "", imageDataUri: ""};
    }
}
