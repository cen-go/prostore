"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Cart, CartItem } from "@/types";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function CartTable({ cart }: { cart?: Cart }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleAddToCart(item: CartItem) {
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

  async function handleRemoveFromCart(item: CartItem) {
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

  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is empty.{" "}
          <Link href="/" className="underline">
            Go Shopping!
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-6 md:gap-5 lg:gap-12">
          <div className="overflow-x-auto md:col-span-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell>
                      <Link
                        href={`/products/${item.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        />
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="flex-center pt-5 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-6 h-6 rounded-full"
                        onClick={() => handleRemoveFromCart(item)}
                        disabled={isPending}
                      >
                        <Minus />
                      </Button>
                      {isPending ? (
                        <Loader className="w-4 h-4 mx-1 animate-spin inline-block" />
                      ) : (
                        <span className="px-2">{item.qnty}</span>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        className="w-6 h-6 rounded-full"
                        onClick={() => handleAddToCart(item)}
                        disabled={isPending}
                      >
                        <Plus />
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(Number(item.price) * item.qnty)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-4 gap-4">
                <div className="pb-3 gap-4 flex justify-between">
                  <span>
                    Subtotal (
                    {cart.items.reduce((sum, item) => sum + item.qnty, 0)}):{" "}
                  </span>
                  <span className="font-bold">
                    {formatCurrency(cart.price)}
                  </span>
                </div>
                <div className="pb-3 gap-4 flex justify-between">
                  <span>Tax: </span>
                  <span className="font-bold">
                    {formatCurrency(cart.taxPrice)}
                  </span>
                </div>
                <div className="pb-3 gap-4 flex justify-between border-b-1">
                  <span>Shipping: </span>
                  <span className="font-bold">
                    {formatCurrency(cart.shippingPrice)}
                  </span>
                </div>
                <div className="pb-3 gap-4 flex justify-between mt-3 text-xl">
                  <span>Total: </span>
                  <span className="font-bold text-emerald-800">
                    {formatCurrency(cart.totalPrice)}
                  </span>
                </div>
                <Button
                  className="w-full"
                  disabled={isPending}
                  onClick={() =>
                    startTransition(() => router.push("/shipping-address"))
                  }
                >
                  {isPending ? (
                    <Loader className="w-4 h-4 animate-spin inline-block" />
                  ) : (
                    <ArrowRight />
                  )} Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
