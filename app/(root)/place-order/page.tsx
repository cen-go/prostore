import { Metadata } from "next"
import { redirect } from "next/navigation"
import Image from "next/image"
import { auth } from "@/auth"
import { getMyCart } from "@/lib/actions/cart.actions"
import { getUserById } from "@/lib/data/getUser"
import { ShippingAddress } from "@/types"
import CheckoutSteps from "@/components/shared/checkout-steps"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Place Order"
}

export default async function PlaceOrderPage() {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) redirect("/");

  const session = await auth();
  const userId = session?.user.id;

  if (!userId) throw new Error("User not found!");

  const user = await getUserById(userId);

  if (!user?.address) redirect("/shipping-address");
  if (!user?.paymentMethod) redirect("/payment-method");

  const userAddress = user.address as ShippingAddress

  return (
    <>
      <div>
        <CheckoutSteps current={3} />
        <h1 className="py-4 text-2xl"> Place Order</h1>
        <div className="grid md:grid-cols-3 md:gap-5">
          <div className="md:col-span-2 overflow-x-auto space-y-4">
            <Card>
              <CardContent className="px-4">
                <h2 className="text-lg pb-4">Shipping Address</h2>
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
            <Card>
              <CardContent className="px-4">
                <h2 className="text-lg pb-4">Payment Method</h2>
                <p>{user.paymentMethod}</p>
                <Button size="sm" variant="outline" asChild className="mt-2">
                  <Link href="/payment-method">Edit</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="px-4">
                <h2 className="text-lg pb-4">Order Items</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.items.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell>
                          <Link
                            href={`/products/${item.slug}`}
                            className="flex items-center gap-1"
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              height={50}
                              width={50}
                            />
                            <span className="text-xs">{item.name}</span>
                          </Link>
                        </TableCell>
                        <TableCell className="text-center">
                          {item.qnty}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(Number(item.price) * item.qnty)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button size="sm" variant="outline" asChild className="mt-2">
                  <Link href="/cart">Edit</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardContent className="px-4 space-y-4">
              <div className="pb-3 gap-4 flex justify-between">
                  <span>
                    Items (
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
                  <span className="font-bold text-emerald-500">
                    {formatCurrency(cart.totalPrice)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}