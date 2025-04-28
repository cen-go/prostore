"use server";

import { prisma } from "@/db/prisma";
import { Product } from "@/types";
import { z } from "zod";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { LATEST_PRODUCTS_LIMIT, PAGINATION_SIZE } from "../constants";
import { convertToPlainObject, formatError } from "../utils";
import { revalidatePath } from "next/cache";
import { insertProductSchema, updateProductSchema } from "../validators";
import { deleteFromS3 } from "./s3.actions";

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

// Get single product by id
export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({where: {id}});

  return convertToPlainObject(product);
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
    orderBy: {createdAt: "desc"},
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

    product.images.map(async (imageUrl:string) => {
      const res = await deleteFromS3(imageUrl);
      if (!res.success) throw new Error("Failed to delete product images");
    })

    await prisma.product.delete({where: {id}});

    revalidatePath("/admin/products");

    return {success: true, message: "Product successfully deleted."}
  } catch (error) {
    return {success: false, message: formatError(error)};
  }
}

// Create new product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const productData = insertProductSchema.parse(data);

    await prisma.product.create({
      data: productData,
    });

    revalidatePath("/admin/products");
    return {success: true, message: "Product successfully created."}

  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}


// Update an existing product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const productData = updateProductSchema.parse(data);

    const existingProduct = await prisma.product.findUnique({
      where: { id: productData.id },
    });

    if (!existingProduct) throw new Error("Product not found!");

    await prisma.product.update({
      where: {id: productData.id},
      data: productData,
    });

    revalidatePath("/admin/products");
    return {success: true, message: "Product successfully updated."}

  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}