"use client";

import { Order } from "@/types";
import { formatDateTime, formatId } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OrderItemsTable from "@/components/shared/order/order-items-table";
import OrderSummary from "@/components/shared/order/order-summary";

export default function name({ order }: { order: Order }) {
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
                <Badge variant="secondary">
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
                <Badge variant="secondary">
                  Paid at {formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Not delivered</Badge>
              )}
            </CardContent>
          </Card>
          <OrderItemsTable items={orderItems} />
        </div>
        <div>
          <Card className="py-4">
            <CardContent className="px-4 space-y-4">
              <OrderSummary
                items={orderItems}
                itemsPrice={itemsPrice}
                taxPrice={taxPrice}
                shippingPrice={shippingPrice}
                totalPrice={totalPrice}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
