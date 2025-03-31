"use server";

import { cookies } from "next/headers";
import { auth } from "@/auth";
import { Cart, CartItem } from "@/types";
import { prisma } from "@/db/prisma";
import { convertToPlainObject, round2 } from "../utils";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";

// Calculate cart prices
function calculatePrice(items: CartItem[]) {
  const itemsPrice = round2(
    items.reduce((sum, item) => sum + Number(item.price) * item.qnty, 0)
  );
  const shippingPrice = round2(itemsPrice < 100 ? 10 : 0);
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    price: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
}

export async function addItemToCart(itemRequested: CartItem) {
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");
    // Get session and user Id
    const session = await auth();
    const userId = session?.user.id;

    //get Cart
    const dbCart = await getMyCart();

    // Parse and validate item
    const item = cartItemSchema.parse(itemRequested);

    // Find product in database
    const dbProduct = await prisma.product.findUnique({
      where: { id: item?.productId },
    });

    if (!dbProduct) throw new Error("Product not available");

    if (!dbCart) {
      // Create a new car object
      const newCart = insertCartSchema.parse({
        userId,
        items: [item],
        sessionCartId,
        ...calculatePrice([item]),
      });
      await prisma.cart.create({ data: newCart });

      // Revalidate product page
      revalidatePath(`/products/${dbProduct.slug}`);
      return { success: true, message: `${itemRequested.name} added to cart` };

    } else {
      // Check if item is already in cart
      const existingItem = (dbCart.items as CartItem[]).find(
        (cartItem) => cartItem.productId === item.productId
      );
      if (existingItem) {
        // Check stock
        if (dbProduct.stock < existingItem.qnty + 1) {
          return { success: false, message: "Not enough stock" };
        }
        // Increase the quantity
        existingItem.qnty++;
      } else {
        // If item does not exist
        // Check the stock
        if (dbProduct.stock < 1) {
          return { success: false, message: "Not enough stock" };
        }
        // Add item to the dbCart.items
        dbCart.items.push(item);
      }

      // Save to database
      await prisma.cart.update({
        where: { id: dbCart.id },
        data: {
          items: dbCart.items,
          ...calculatePrice(dbCart.items as CartItem[]),
        },
      });
      // Revalidate product page
      revalidatePath(`/products/${dbProduct.slug}`);
      return {
        success: true,
        message: `${itemRequested.name} ${
          existingItem ? "updated in" : "added to"
        } cart`,
      };
    }

  } catch (error) {
    return { success: false, message: "Failed to add item", error };
  }
}

// Get user cart from database
export async function getMyCart(): Promise<Cart | undefined> {
  // Check for cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart session not found");
  // Get session and user Id
  const session = await auth();
  const userId = session?.user.id;

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId },
  });

  if (!cart) return undefined;

  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    price: cart.price.toString(),
    totalPrice: cart.taxPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}


export async function removeItemFromCart(productId:string) {
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    // Get product
    const dbProduct = await prisma.product.findUnique({where: {id: productId}});

    if (!dbProduct) {
    return { success: false, message: "Product not found" };
    }

    // Get user cart
    const dbCart = await getMyCart();
    if (!dbCart) {
    return { success: false, message: "Cart not found" };
    }

    // Check if the item exists
    const existingItem = (dbCart.items as CartItem[]).find(
      (cartItem) => cartItem.productId === dbProduct.id
    );

    if (!existingItem) {
    return { success: false, message: "Product does not exist in cart" };
    }

    // Check the item quantity in the cart
    if (existingItem.qnty > 1) {
      // Decrease the quantity by one
      existingItem.qnty--;
    } else if (existingItem.qnty === 1) {
      // Remove item from the cart
      dbCart.items = (dbCart.items as CartItem[]).filter(
        (item) => item.productId !== existingItem.productId
      );
    }

    // Update cart in database
    await prisma.cart.update({
      where: {id: dbCart.id},
      data: {
        items: dbCart.items,
        ...calculatePrice(dbCart.items as CartItem[]),
      }
    });

    revalidatePath(`/products/${dbProduct.slug}`);
    return { success: true, message: `${dbProduct.name} removed from cart` };

  } catch (error) {
    return { success: false, message: "Something went wrong", error };
  }
}