
"use server";

import { cookies } from "next/headers";
import * as z from "zod";
import { ADMIN_USERNAME, ADMIN_PASSWORD, AUTH_COOKIE_NAME } from "@/lib/auth-constants";
import { revalidatePath } from "next/cache";

const loginFormSchema = z.object({
  username: z.string(),
  password: z.string(),
});

interface LoginResult {
  success: boolean;
  error?: string;
}

export async function login(
  values: z.infer<typeof loginFormSchema>
): Promise<LoginResult> {
  const validationResult = loginFormSchema.safeParse(values);

  if (!validationResult.success) {
    return { success: false, error: "Invalid form data." };
  }

  const { username, password } = validationResult.data;

  // IMPORTANT: This is highly insecure. In a real application,
  // use a proper authentication system with hashed passwords and a secure session mechanism.
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Set a simple cookie for session management
    cookies().set(AUTH_COOKIE_NAME, "loggedIn", { // The value "loggedIn" is arbitrary for this prototype
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    revalidatePath('/admin', 'layout');
    return { success: true };
  } else {
    return { success: false, error: "Invalid username or password." };
  }
}

export async function logout(): Promise<{ success: boolean }> {
  cookies().delete(AUTH_COOKIE_NAME);
  revalidatePath('/admin', 'layout');
  revalidatePath('/admin/login');
  return { success: true };
}
