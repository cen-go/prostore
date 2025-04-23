"use server"

import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "../data/getUser";
import { insertOrderSchema } from "../validators";
import { CartItem} from "@/types";
import { PaymentResult } from "@/types";
import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";
import { PAGINATION_SIZE } from "../constants";

// create order and oderItems
export async function createOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error("User is not authenticated!");

    const cart = await getMyCart();

    const userId = session.user?.id;
    const user = await getUserById(userId);

    if (!user) throw new Error("User not found!");

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Your cart is empty.",
        redirectTo: "/",
      };
    }
    if (!user.address) {
      return {
        success: false,
        message: "No shipping address.",
        redirectTo: "/shipping-address",
      };
    }
    if (!user.paymentMethod) {
      return {
        success: false,
        message: "No payment method.",
        redirectTo: "/payment-method",
      };
    }

    // Create order object
    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.price,
      taxPrice: cart.taxPrice,
      shippingPrice: cart.shippingPrice,
      totalPrice: cart.totalPrice,
    });

    // Create a transaction to create order and orderItems in db
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      // Create order
      const insertedOrder = await tx.order.create({ data: order });
      // Create the orderItems from cart items
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            orderId: insertedOrder.id,
          },
        });
      }

      // Clear the cart
      await tx.cart.update({
        where: {id: cart.id},
        data: {
          items: [],
          price: 0,
          taxPrice: 0,
          shippingPrice: 0,
          totalPrice: 0,
        },
      });

      return insertedOrder.id;
    });

    if (!insertedOrderId) throw new Error("Order not created!");

    return {
      success: true,
      message: "Order created.",
      redirectTo: `/order/${insertedOrderId}`,
    };

  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: formatError(error) };
  }
}

// Get order by Id
export async function getOrderById(orderId:string) {
  const orderData = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: true,
      user: {select: {name: true, email: true}},
    },
  });

  return convertToPlainObject(orderData);
}

// Create new paypal order
export async function createPaypalOrder(orderId:string) {
  try {
    // Get order from the database
    const order = await prisma.order.findUnique({
      where: {id: orderId},
    });

    if (order) {
      // create paypal order
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice))
      //Update order in db with paypal order ID
      await prisma.order.update({
        where: {id: orderId},
        data: {paymentResult: {
          id: paypalOrder.id,
          email_address: "",
          status: "",
          pricePaid: 0,
        }}
      });

      return {
        success: true,
        message: "Order created successfully.",
        data: paypalOrder.id,
      };
    } else {
      throw new Error("Order not found!");
    }
  } catch (error) {
    return {success: false, message: formatError(error)};
  }
}

// Approve paypal order and update it to paid
export async function approvePaypalOrder(
  orderId: string,
  data: { orderID: string }
) {
  try {
    // Get order from the database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new Error("Order not found!");

    const capturedPaymentData = await paypal.capturePayment(data.orderID);

    if (
      !capturedPaymentData ||
      capturedPaymentData.id !== (order.paymentResult as PaymentResult)?.id ||
      capturedPaymentData.status !== "COMPLETED"
    ) {
      throw new Error("Error in PayPal payment!");
    }

    //update order to paid
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: capturedPaymentData.id,
        status: capturedPaymentData.status,
        email_address: capturedPaymentData.payer.email_address,
        pricePaid:
          capturedPaymentData.purchase_units[0]?.payments?.captures[0]?.amount
            ?.value,
      },
    });

    revalidatePath(`/order/${orderId}`);
    return {success:true, message: "Your order has been paid"};
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update order in db to paid
async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) {
  // Get order from the database
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {orderItems: true},
  });

  if (!order) throw new Error("Order not found!");

  if (order.isPaid) throw new Error("Order is already paid!");

  // Transaction to update order and the product stock
  await prisma.$transaction(async (tx) => {
    // iterate over products and update stock
    for (const item of order.orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: -item.qnty } },
      });
    }

    // Set the order to paid
    await tx.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    });
  });

  const updatedOrder = await prisma.order.findUnique({
    where: { id: orderId},
    include:{
      orderItems: true,
      user: {select: {name: true, email: true}},
    },
  });

  if (!updatedOrder) throw new Error("Order not found!");

}

// Get user's orders
export async function getMyOrders({
  limit = PAGINATION_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("User not found.");

  const ordersData = await prisma.order.findMany({
    where: {userId: session.user.id},
    orderBy: {createdAt: "desc"},
    take: limit,
    skip: limit * (page - 1),
  });

  const ordersCount = await prisma.order.count({
    where: {userId: session.user.id},
  });

  return {
    ordersData,
    pages: Math.ceil(ordersCount / limit),
  };

}

// Get sales data and orders summary
type salesDataType = {
  month: string;
  totalSales: number;
};

export async function getOrdersSummary() {
  // Get counts for each resource
  const ordersCount = await prisma.order.count();
  const productsCount = await prisma.product.count();
  const usersCount = await prisma.user.count();

  // Calculate total sales
  const totalSales = await prisma.order.aggregate({
    _sum: {totalPrice: true},
    where: {isPaid: true},
  });

  // Get monthly sales
  const salesDataRaw = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Prisma.Decimal }>
  >`SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" 
    FROM "Order" 
    WHERE "isPaid" = true
    GROUP BY to_char("createdAt", 'MM/YY')
    ORDER BY "month" ASC`;

  const salesData: salesDataType[] = salesDataRaw.map(entry => ({
    month: entry.month,
    totalSales: Number(entry.totalSales),
  }))

  // Get latest sales
  const latestSales = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true } },
    },
    take: 6,
  });

  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    latestSales,
    salesData,
  };

}

// Get all orders
export async function getAllOrders({
  limit = PAGINATION_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const data = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
    include: {
      user: {
        select: { name: true },
      },
    },
  });

  const dataCount = await prisma.order.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete an order
export async function deleteOrder(id: string) {
  try {
    await prisma.order.delete({where: { id }});

    revalidatePath("/admin/orders");

    return {success: true, message: "Order successfully deleted."}
  } catch (error) {
    return {success: false, message: formatError(error)};
  }
}

// Update COD order to paid
export async function updateCODOrderToPaid(orderId: string) {
  try {
    await updateOrderToPaid({orderId});

    revalidatePath(`/order/${orderId}`);

    return {success: true, message: "Order marked as paid."};
  } catch (error) {
    return {success:false, message: formatError(error)};
  }
}

// Update COD order to delivered
export async function deliverOrder(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new Error("Order not found!");
    if (!order.isPaid) throw new Error("Order is not paid!");

    await prisma.order.update({
      where: { id: orderId },
      data: { isDelivered: true, deliveredAt: new Date() },
    });

    revalidatePath(`/order/${orderId}`);
    return { success: true, message: "Order marked as delivered." };

  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}