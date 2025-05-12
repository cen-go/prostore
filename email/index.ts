import { Resend } from "resend";
import { SENDER_EMAIL, APP_NAME } from "@/lib/constants";
import { Order } from "@/types";
import PurchaseReceiptEmail from "./purchase-receipt";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPurchaseReceipt({ order }: { order: Order }) {
  if (!order.user || !order.user.email) throw new Error("User is deleted!");

  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user.email,
    subject: `Order Confirmation ${order.id}`,
    react: PurchaseReceiptEmail({ order }),
  });
}
