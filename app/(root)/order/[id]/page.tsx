
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/actions/order.actions";
import { ShippingAddress } from "@/types";
import OrderDetailsTable from "./order-details-table";
import { auth } from "@/auth";
import Stripe from "stripe";
import { PaymentMethod } from "@prisma/client";

export const metadata: Metadata = {
  title: "Order Details"
}

export default async function OrderDetailsPage({
  params,
}: {params : Promise<{id: string}>}) {
  const { id } = await params;
  const session = await auth();

  const order = await getOrderById(id);
  if(!order) notFound();

  let stripe_client_secret = null;

  // Check if is not payed and payment method is stripe
  if (order.paymentMethod === PaymentMethod.Stripe && !order.isPaid) {
    // Init stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    // Create payment intent
    const paymentIntent = stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: "USD",
      metadata: {orderId : order.id},
    });
    stripe_client_secret =  (await paymentIntent).client_secret;
  }

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
      }}
      stripeClientSecret={stripe_client_secret}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
      isAdmin={session?.user?.role === "admin"}
    />
  );
}
