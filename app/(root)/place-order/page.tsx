import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";

import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/data/getUser";
import { ShippingAddress } from "@/types";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PlaceOrderForm from "./place-order-form";
import OrderItemsTable from "@/components/shared/order/order-items-table";
import OrderSummary from "@/components/shared/order/order-summary";

export const metadata: Metadata = {
  title: "Place Order",
};

export default async function PlaceOrderPage() {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) redirect("/");

  const session = await auth();
  const userId = session?.user.id;

  if (!userId) throw new Error("User not found!");

  const user = await getUserById(userId);

  if (!user?.address) redirect("/shipping-address");
  if (!user?.paymentMethod) redirect("/payment-method");

  const userAddress = user.address as ShippingAddress;

  return (
    <>
      <div>
        <CheckoutSteps current={3} />
        <h1 className="py-4 text-2xl"> Place Order</h1>
        <div className="grid md:grid-cols-3 md:gap-5">
          <div className="md:col-span-2 overflow-x-auto space-y-4">
            <Card className="py-4">
              <CardContent className="px-4">
                <h2 className="text-lg pb-3">Shipping Address</h2>
                <p>{userAddress.fullName}</p>
                <p>
                  {userAddress.streetAddress}, {userAddress.city}{" "}
                  {userAddress.postalCode}, {userAddress.country}{" "}
                </p>
                <Button size="sm" variant="outline" asChild className="mt-2">
                  <Link href="/shipping-address">Edit</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="py-4">
              <CardContent className="px-4">
                <h2 className="text-lg pb-3">Payment Method</h2>
                <p>{user.paymentMethod}</p>
                <Button size="sm" variant="outline" asChild className="mt-2">
                  <Link href="/payment-method">Edit</Link>
                </Button>
              </CardContent>
            </Card>
            <OrderItemsTable items={cart.items} />
          </div>
          <div>
            <Card className="py-4">
              <CardContent className="px-4 space-y-4">
                <OrderSummary
                  items={cart.items}
                  itemsPrice={cart.price}
                  taxPrice={cart.taxPrice}
                  shippingPrice={cart.shippingPrice}
                  totalPrice={cart.totalPrice}
                />
                <PlaceOrderForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
