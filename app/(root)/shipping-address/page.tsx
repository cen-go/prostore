import { auth } from "@/auth"
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getMyCart } from "@/lib/actions/cart.actions";
import { ShippingAddress } from "@/types";
import { getUserById } from "@/lib/data/getUser";
import ShippingAddressForm from "./shipping-address-form";

export const metadata: Metadata = {
  title: "Shipping Address",
}

export default async function ShippingAddressPage() {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) redirect("/cart");

  const session = await auth()
  const userId =  session?.user?.id;

  if (!userId) redirect("/");

  const user = await getUserById(userId);

  return (
    <>
      <ShippingAddressForm address={user?.address as ShippingAddress} />
    </>
  )
}