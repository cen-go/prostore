import { ShippingAddress } from "@/types";
import { PaymentMethod } from "@prisma/client";

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Prostore";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "A modern ecommerce platform built with Next.js";

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const shippingAddressDefaults: ShippingAddress = {
  addressTitle: "",
  fullName: "",
  streetAddress: "",
  city: "",
  postalCode: "",
  country: "",
}

export const PAYMENT_METHODS = [
  PaymentMethod.PayPal,
  PaymentMethod.Stripe,
  PaymentMethod.CashOnDelivery,
];

export const DEFAULT_PAYMENT_METHOD = PaymentMethod.PayPal;