"use server";

import z from "zod"
import { isRedirectError } from "next/dist/client/components/redirect-error";
import {
  shippingAddressSchema,
  SignInFormSchema,
  SignUpFormSchema,
  paymentMethodSchema
} from "../validators";
import { auth, signIn, signOut } from "@/auth";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { ShippingAddress } from "@/types";
import { getUserById } from "../data/getUser";

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
      const zodErrors = validatedData.error.format();
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

    const user = validatedData.data;

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

// Update user's address
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();

    if (!session?.user) {
      return {
        success: false,
        message:
          "You need to be logged in, in order to save your shipping address!",
      };
    }

    const currentUser = await getUserById(session?.user.id);

    if (!currentUser) {
      return { success: false, message: "User not found!" };
    }

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });

    return {success: true, message: "Address updated successfully"}
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: formatError(error) };
  }
}

// Update user patment method
export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>
) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findUnique({
      where: { id: session?.user?.id },
    });

    if (!currentUser) {
      throw new Error("No user found");
    }

    const paymentMethod = paymentMethodSchema.parse(data).type;

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod },
    });

    return { success: true, message: "Payment method updated" };

  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// update the user profile
export async function updateProfile(user: { name: string; email: string }) {
  try {
    const session = await auth();
    if (!session) throw new Error("Invalid session!");

    const userId = session.user.id;
    const currentUser = await prisma.user.findUnique({ where: { id: userId } });

    if (!currentUser) throw new Error("User not found!");

    await prisma.user.update({
      where: { id: userId },
      data: { name: user.name },
    });

    return { success: true, message: "User updated successfully." };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}