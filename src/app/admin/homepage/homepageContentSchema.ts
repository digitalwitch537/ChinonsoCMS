
import * as z from "zod";

export const homepageContentSchema = z.object({
  professionalPhotoUrl: z.string().url("Must be a valid URL if 'Image URL' source is selected.").optional().or(z.literal('')),
  imageDataUri: z.string().optional().or(z.literal('')),
  bio: z.string().min(50, "Bio must be at least 50 characters."),
}).refine(data => {
    if (data.professionalPhotoUrl && data.imageDataUri) return false;
    return true;
}, { message: "Provide either a Photo URL or an Uploaded Photo, not both.", path: ["professionalPhotoUrl"] });


export type HomepageContentValues = z.infer<typeof homepageContentSchema>;

