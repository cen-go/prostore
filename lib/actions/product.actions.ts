"use server";

import { prisma } from "@/db/prisma";
import { Product } from "@/types";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

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