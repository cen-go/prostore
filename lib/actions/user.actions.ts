"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { SignInFormSchema } from "../validators";
import { signIn, signOut } from "@/auth";

// Sign in the user with credentials
export async function SignInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = SignInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", {
      email: user.email,
      password: user.password,
    });

    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: "invalid email or password" };
  }
}

// Sign user out
export async function SignOutUser() {
  await signOut();
}