
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { addCollectionItem, updateCollectionItem, deleteCollectionItem, getCollectionItemBySlugOrId } from "@/lib/data-service";
import type { BlogPost } from "@/lib/types";
import removeMarkdown from "remove-markdown";

// Schema for individual blog post data, matching fields in config.yml and types.ts
// ID and slug are often handled by filename/Decap, but good to have in schema if passed around.
const blogPostSchema = z.object({
  id: z.string().optional(), // Decap might not always send this if filename is ID
  slug: z.string().min(3, "Slug must be at least 3 characters.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens."),
  title: z.string().min(5, "Title must be at least 5 characters."),
  author: z.string().min(2, "Author name is required."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format."),
  // Excerpt will be auto-generated if not provided by Decap based on content
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters.").max(300, "Excerpt must be 300 characters or less.").optional(),
  content: z.string().min(10, "Content must be at least 10 characters. Use Markdown for formatting."),
  imageUrl: z.string().url("Must be a valid URL if 'Image URL' is selected.").optional().or(z.literal('')),
  imageDataUri: z.string().optional().or(z.literal('')),
  tags: z.array(z.string().min(1, "Tag cannot be empty.")).optional(),
}).refine(data => {
    if (data.imageUrl && data.imageDataUri) return false; 
    return true;
}, { message: "Provide either a Featured Image URL or an Uploaded Featured Image, not both.", path: ["imageUrl"] });

// Auto-generate excerpt from content if not provided
function generateExcerpt(markdownContent: string, maxLength = 200): string {
  const plainText = removeMarkdown(markdownContent);
  if (plainText.length <= maxLength) {
    return plainText;
  }
  return plainText.substring(0, plainText.lastIndexOf(' ', maxLength)) + '...';
}


export async function createBlogPostAction(values: z.infer<typeof blogPostSchema>): Promise<{ success: boolean; error?: string; post?: BlogPost }> {
  const validation = blogPostSchema.safeParse(values);
  if (!validation.success) {
    return { success: false, error: JSON.stringify(validation.error.flatten().fieldErrors) };
  }
  
  let dataToSave = { ...validation.data };
  if (dataToSave.imageDataUri) {
    dataToSave.imageUrl = ""; 
  }
  if (!dataToSave.excerpt && dataToSave.content) {
    dataToSave.excerpt = generateExcerpt(dataToSave.content);
  }

  try {
    // Decap CMS handles file creation based on slug. This action might be for other uses or a fallback.
    // If Decap controls creation, this server action might mostly be for revalidation or other side effects.
    // For this example, we assume this action can create if needed (e.g., programmatically).
    const newPost = await addCollectionItem<BlogPost>('blogPosts', dataToSave as Omit<BlogPost, 'id' | 'slug'>);
    revalidatePath("/admin/blog"); // For Decap's UI if it lists items
    revalidatePath("/blog");
    revalidatePath(`/blog/${newPost.slug}`);
    revalidatePath("/"); 
    return { success: true, post: newPost };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: error.message };
  }
}

export async function updateBlogPostAction(slug: string, values: z.infer<typeof blogPostSchema>): Promise<{ success: boolean; error?: string; post?: BlogPost }> {
   const validation = blogPostSchema.safeParse(values);
  if (!validation.success) {
    return { success: false, error: JSON.stringify(validation.error.flatten().fieldErrors) };
  }

  let dataToSave = { ...validation.data };
  if (dataToSave.imageDataUri) {
    dataToSave.imageUrl = ""; 
  }
   if (!dataToSave.excerpt && dataToSave.content) {
    dataToSave.excerpt = generateExcerpt(dataToSave.content);
  }

  try {
    const updatedPost = await updateCollectionItem<BlogPost>('blogPosts', slug, dataToSave);
    if (!updatedPost) return { success: false, error: "Post not found." };
    
    revalidatePath("/admin/blog"); // For Decap
    revalidatePath("/blog");
    revalidatePath(`/blog/${updatedPost.slug}`);
    revalidatePath("/");
    return { success: true, post: updatedPost };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: error.message };
  }
}

export async function deleteBlogPostAction(slug: string): Promise<{ success: boolean; error?: string }> {
  try {
    const deleted = await deleteCollectionItem('blogPosts', slug);
    if (!deleted) return { success: false, error: "Post not found or already deleted." };
    
    revalidatePath("/admin/blog"); // For Decap
    revalidatePath("/blog");
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: error.message };
  }
}
