
import Link from "next/link"
import { Metadata } from "next"
import { getAllOrders, deleteOrder } from "@/lib/actions/order.actions"
import { requireAdmin } from "@/lib/auth-guard"
import Pagination from "@/components/shared/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import DeleteDialog from "@/components/shared/delete-dialog"

export const metadata: Metadata = {
  title: "Admin Orders",
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  await requireAdmin();
  const { page } = await searchParams;

  const ordersData = await getAllOrders({ page: Number(page) || 1 });

  return (
    <div className="space-y-2">
      <h2 className="h2-bold">Orders</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>USER</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAID</TableHead>
              <TableHead>DELIVERED</TableHead>
              <TableHead className="text-center">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersData.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt).dateOnly}
                </TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>
                  {order.isPaid ? (
                    <Badge variant="default">Paid</Badge>
                  ) : (
                    <Badge variant="destructive">Not paid</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {order.isDelivered ? (
                    <Badge variant="default">Delivered</Badge>
                  ) : (
                    <Badge variant="destructive">Not delivered</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/order/${order.id}`}>Details</Link>
                  </Button>
                  <DeleteDialog id={order.id} action={deleteOrder} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {ordersData.totalPages > 1 && (
          <Pagination
            page={Number(page) || 1}
            totalPages={ordersData?.totalPages}
          />
        )}
      </div>
    </div>
  );
}