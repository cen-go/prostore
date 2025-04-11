"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Cart } from "@/types";
import { ArrowRight, Loader } from "lucide-react";
import { useTransition } from "react";

export default function TotalPriceCard({
  cart,
  onClick,
  buttonLabel,
}: {
  cart: Cart;
  onClick: () => void | Promise<void>
  buttonLabel: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Card>
      <CardContent className="p-4 gap-4">
        <div className="pb-3 gap-4 flex justify-between">
          <span>
            Subtotal ({cart.items.reduce((sum, item) => sum + item.qnty, 0)}):{" "}
          </span>
          <span className="font-bold">{formatCurrency(cart.price)}</span>
        </div>
        <div className="pb-3 gap-4 flex justify-between">
          <span>Tax: </span>
          <span className="font-bold">{formatCurrency(cart.taxPrice)}</span>
        </div>
        <div className="pb-3 gap-4 flex justify-between border-b-1">
          <span>Shipping: </span>
          <span className="font-bold">
            {formatCurrency(cart.shippingPrice)}
          </span>
        </div>
        <div className="pb-3 gap-4 flex justify-between mt-3 text-xl">
          <span>Total: </span>
          <span className="font-bold text-emerald-500">
            {formatCurrency(cart.totalPrice)}
          </span>
        </div>
        <Button
          className="w-full"
          disabled={isPending}
          onClick={() => startTransition(() => onClick())}
        >
          {isPending ? (
            <Loader className="w-4 h-4 animate-spin inline-block" />
          ) : (
            <ArrowRight />
          )}{" "}
          {buttonLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
