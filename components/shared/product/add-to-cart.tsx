"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Minus } from "lucide-react";
import { toast } from "sonner"
import { CartItem } from "@/types";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Cart } from "@/types";

export default function AddToCart({ item, cart }: {item: CartItem, cart?: Cart}) {
  const router = useRouter();

  async function handleAddToCart() {
    const response = await addItemToCart(item);

    if (!response.success) {
      toast.error(response.message);
    } else {
      toast.success(response.message, {
        action: {
          label: "Go to Cart",
          onClick: () => router.push("/cart"),
        },
      });
    }
  }

  async function handleRemoveFromCart() {
    const response = await removeItemFromCart(item.productId);

    if (!response.success) {
      toast.error(response.message);
    } else {
      toast.success(response.message, {
        action: {
          label: "Go to Cart",
          onClick: () => router.push("/cart"),
        },
      });
    }
  }

  // Check if the item is already in cart
  const existingItem = cart?.items.find(
    (cartItem) => cartItem.productId === item.productId
  );

  if (existingItem) {
    return (
      <div>
        <Button
          type="button"
          variant="outline"
          className="w-8 h-8 rounded-full"
          onClick={handleRemoveFromCart}
        >
          <Minus />
        </Button>
        <span className="px-3">{existingItem.qnty}</span>
        <Button
          type="button"
          variant="outline"
          className="w-8 h-8 rounded-full"
          onClick={handleAddToCart}
        >
          <Plus />
        </Button>
      </div>
    );
  }

  return (
    <Button className="w-full" type="button"  onClick={handleAddToCart}>
      Add to Cart
    </Button>
  )
}