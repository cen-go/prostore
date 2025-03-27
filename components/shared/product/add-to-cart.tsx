"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
// import { Plus } from "lucide-react";
import { toast } from "sonner"
import { CartItem } from "@/types";
import { addItemToCart } from "@/lib/actions/cart.actions";

export default function AddToCart({ item }: {item: CartItem}) {
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

  return (
    <Button className="w-full" type="button"  onClick={handleAddToCart}>
      Add to Cart
    </Button>
  )
}