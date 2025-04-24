"use server";

import { prisma } from "@/db/prisma";
import { Product } from "@/types";
import { z } from "zod";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { LATEST_PRODUCTS_LIMIT, PAGINATION_SIZE } from "../constants";
import { formatError } from "../utils";
import { revalidatePath } from "next/cache";
import { insertProductSchema } from "../validators";

// Get latest products
export async function getLatestProducts(): Promise<Product[]> {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: {createdAt: "desc"}
  });

  return data;
}

// Get single product by slug
export async function getProductBySlug(slug:string): Promise<Product | null> {
  const product = await prisma.product.findFirst({
    where: {slug}
  });

  return product;
}

// Get all products
export async function getAllProducts({
  limit = PAGINATION_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const data = await prisma.product.findMany({
    skip: limit * (page - 1),
    take: limit,
  });

  const dataCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };

}

// DeleteProduct
export async function deleteProduct(id:string) {
  try {
    const product = await prisma.product.findUnique({where:{id}});

    if (!product) throw new Error("Product not found!");

    await prisma.product.delete({where: {id}});

    revalidatePath("/admin/products");

    return {success: true, message: "Product successfully deleted."}
  } catch (error) {
    return {success: false, message: formatError(error)};
  }
}

// Create new product
export async function CreateProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const productData = insertProductSchema.parse(data);

    await prisma.product.create({
      data: {...productData},
    });

  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}