"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { SignInFormSchema, SignUpFormSchema } from "../validators";
import { signIn, signOut } from "@/auth";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";

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

// Sign Up user
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const validatedData = SignUpFormSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!validatedData.success) {
      const zodErrors = validatedData.error.format()
      return {
        success: false,
        message: "Invalid fields",
        errors: {
          name: zodErrors.name?._errors[0] || "",
          email: zodErrors.email?._errors[0] || "",
          password: zodErrors.password?._errors[0] || "",
          confirmPassword: zodErrors.confirmPassword?._errors[0] || "",
        },
      };
    }

    const user  = validatedData.data

    const hashedPassword = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: hashedPassword,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: user.password,
    });

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: formatError(error) };
  }
}
