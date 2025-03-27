"use server"

import { CartItem } from "@/types"

export async function addItemToCart(item: CartItem) {
  return {success: true, message: `${item.name} added to cart`};
}