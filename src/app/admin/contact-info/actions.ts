
"use server";

import { revalidatePath } from "next/cache";
import { getContactInfo as getData, updateContactInfo as updateData } from "@/lib/data-service";
import type { ContactInfo } from "@/lib/types";
import { contactInfoSchema, type ContactInfoValues } from "./contactInfoSchema"; 

export async function getContactInfoAction(): Promise<ContactInfo> {
  try {
    const data = await getData();
    return {
        ...data,
        email: data.email || "your-email@example.com",
        phone: data.phone || "Your Phone Number",
        address: data.address || "Your Address",
        businessHours: data.businessHours || "Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 2:00 PM (By appointment)\nSunday: Closed",
    };
  } catch (e) {
    console.error("Failed to load contact info:", e);
    return { 
        email: "error@example.com", 
        phone: "", 
        address: "", 
        businessHours: "Error loading hours"
    };
  }
}

export async function updateContactInfoAction(
  values: ContactInfoValues
): Promise<{ success: boolean; error?: string; data?: ContactInfo }> {
  const validation = contactInfoSchema.safeParse(values);
  if (!validation.success) {
    const errorMessages = validation.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('; ');
    return { success: false, error: errorMessages };
  }

  try {
    // Ensure all fields, even if optional and empty, are passed to updateData
    const dataToSave: ContactInfo = {
        email: validation.data.email,
        phone: validation.data.phone || "",
        address: validation.data.address || "",
        businessHours: validation.data.businessHours || "",
    };
    await updateData(dataToSave);
    revalidatePath("/admin/contact-info"); // For Decap
    revalidatePath("/contact"); 
    return { success: true, data: dataToSave };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: error.message };
  }
}
