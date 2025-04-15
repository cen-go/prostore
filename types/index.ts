import { z } from "zod";

import {
  insertProductSchema,
  cartItemSchema,
  insertCartSchema,
  shippingAddressSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  paymentResultSchema,
} from "@/lib/validators";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  numReviews: number;
  createdAt: Date;
};

export type Cart = z.infer<typeof insertCartSchema>;

export type CartItem = z.infer<typeof cartItemSchema>;

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  createdAt: Date;
  orderItems: OrderItem[];
  user: {name: string; email: string;};
};

export type PaymentResult = z.infer<typeof paymentResultSchema>;