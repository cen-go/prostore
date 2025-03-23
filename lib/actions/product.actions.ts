"use server";

import { PrismaClient } from "@prisma/client";
import { Product } from "@/types";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

export async function getLatestProducts(): Promise<Product[]> {
  const prisma = new PrismaClient();

  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: {createdAt: "desc"}
  });

  return data.map(product => ({
    ...product,
    price: product.price.toString(),
    rating: product.rating.toString(),
  }));
}