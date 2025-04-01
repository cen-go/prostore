"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Minus, Loader } from "lucide-react";
import { toast } from "sonner";
import { CartItem } from "@/types";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Cart } from "@/types";

export default function AddToCart({
  item,
  cart,
}: {
  item: CartItem;
  cart?: Cart;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleAddToCart() {
    startTransition(async () => {
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
      return;
    });
  }

  async function handleRemoveFromCart() {
    startTransition(async () => {
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
      return;
    });
  }

  // Check if the item is already in cart
  const existingItem = cart?.items.find(
    (cartItem) => cartItem.productId === item.productId
  );

  if (existingItem) {
    return (
      <div className="flex items-center">
        <Button
          type="button"
          variant="outline"
          className="w-8 h-8 rounded-full"
          onClick={handleRemoveFromCart}
          disabled={isPending}
        >
          <Minus />
        </Button>
        {isPending ? (
          <Loader className="w-4 h-4 mx-2 animate-spin inline-block" />
        ) : (
          <span className="px-3">{existingItem.qnty}</span>
        )}
        <Button
          type="button"
          variant="outline"
          className="w-8 h-8 rounded-full"
          onClick={handleAddToCart}
          disabled={isPending}
        >
          <Plus />
        </Button>
      </div>
    );
  }

  return (
    <Button
      className="w-full"
      type="button"
      onClick={handleAddToCart}
      disabled={isPending}
    >
      Add to Cart
    </Button>
  );
}
