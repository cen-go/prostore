import Image from "next/image";
import Link from "next/link";
import { CartItem, OrderItem } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

export default function OrderItemsTable({ items }: { items: OrderItem[] | CartItem[]}) {
  return (
    <Card className="py-4">
            <CardContent className="px-4">
            <h2 className="text-lg pb-2">Order Items</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
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
            </CardContent>
          </Card>
  )
}