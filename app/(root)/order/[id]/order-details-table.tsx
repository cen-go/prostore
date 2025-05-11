"use client";

import { PaymentMethod } from "@prisma/client";
import { useTransition } from "react";
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { Order } from "@/types";
import { formatDateTime, formatId } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import OrderItemsTable from "@/components/shared/order/order-items-table";
import OrderSummary from "@/components/shared/order/order-summary";
import {
  createPaypalOrder,
  approvePaypalOrder,
  updateCODOrderToPaid,
  deliverOrder,
} from "@/lib/actions/order.actions";
import StripePayment from "./stripe-payment";

export default function OrderDetailsTable({
  order,
  paypalClientId,
  stripeClientSecret,
  isAdmin,
}: {
  order: Order;
  paypalClientId: string;
  stripeClientSecret?: string | null;
  isAdmin: boolean;
}) {
  // destructure order prop
  const {
    id,
    shippingAddress,
    orderItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isDelivered,
    isPaid,
    paidAt,
    deliveredAt,
  } = order;

  const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    let status = "";

    if (isPending) {
      status = "Connecting PayPal...";
    } else if (isRejected) {
      status = "Error connecting PayPal";
    }
    return status;
  };

  async function handleCreatePayPalOrder() {
    const res = await createPaypalOrder(order.id);

    if (!res.success) {
      toast.error(res.message);
    }

    return res.data;
  }

  async function handleApprovePayPalOrder(data: { orderID: string }) {
    const res = await approvePaypalOrder(order.id, data);

    if (!res.success) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
    }
  }

  // Button to mark the order as paid
  const MarkAsPaidButton = () => {
    const [isPending, startTransition] = useTransition();
    return (
      <Button
        size="sm"
        className="w-full"
        type="button"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            const res = await updateCODOrderToPaid(id);
            if (!res.success) toast.error(res.message);
            toast.success(res.message);
          });
        }}
      >
        {isPending ? "Processing..." : "Mark as Paid"}
      </Button>
    );
  };
  // Button to mark the order as delivered
  const MarkAsDeliveredButton = () => {
    const [isPending, startTransition] = useTransition();
    return (
      <Button
        size="sm"
        className="w-full"
        type="button"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            const res = await deliverOrder(id);
            if (!res.success) toast.error(res.message);
            toast.success(res.message);
          });
        }}
      >
        {isPending ? "Processing..." : "Mark as Delivered"}
      </Button>
    );
  };

  return (
    <div>
      <h1 className="py-4 text-xl">Order {formatId(id)}</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-y-4 overflow-x-auto">
          <Card className="py-4">
            <CardContent className="px-4">
              <h2 className="text-lg pb-2">Payment Method</h2>
              <p className="mb-1">{paymentMethod}</p>
              {isPaid ? (
                <Badge variant="default">
                  Paid at {formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Not paid</Badge>
              )}
            </CardContent>
          </Card>
          <Card className="py-4">
            <CardContent className="px-4">
              <h2 className="text-lg pb-2">Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p className="mb-1">
                {shippingAddress.streetAddress}, {shippingAddress.city}{" "}
                {shippingAddress.postalCode}, {shippingAddress.country}{" "}
              </p>
              {isDelivered ? (
                <Badge variant="default">
                  Delivered at {formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Not delivered</Badge>
              )}
            </CardContent>
          </Card>
          <OrderItemsTable items={orderItems} />
        </div>
        <div>
          <Card className="py-4 my-4">
            <CardContent className="px-4 space-y-4">
              <OrderSummary
                items={orderItems}
                itemsPrice={itemsPrice}
                taxPrice={taxPrice}
                shippingPrice={shippingPrice}
                totalPrice={totalPrice}
              />

              {/* PayPal Payment */}
              {!isPaid && paymentMethod === PaymentMethod.PayPal && (
                <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                  <PrintLoadingState />
                  <PayPalButtons
                    createOrder={handleCreatePayPalOrder}
                    onApprove={handleApprovePayPalOrder}
                    fundingSource="paypal"
                  />
                </PayPalScriptProvider>
              )}

              {/* Stripe Payment */}
              {!isPaid &&
                paymentMethod === PaymentMethod.Stripe &&
                stripeClientSecret && (
                  <StripePayment
                    orderId={order.id}
                    priceInCents={Math.round(Number(order.totalPrice) * 100)}
                    clientSecret={stripeClientSecret}
                  />
                )}

              {/* Cash on Delivery */}
              {isAdmin &&
                !isPaid &&
                paymentMethod === PaymentMethod.CashOnDelivery && (
                  <MarkAsPaidButton />
                )}
              {isAdmin && isAdmin && !isDelivered && <MarkAsDeliveredButton />}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
