
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
  searchParams: Promise<{ page: string; query: string; }>;
}) {
  await requireAdmin();
  const queryParams = await searchParams;
  const page = Number(queryParams.page) || 1;
  const query = queryParams.query || "";

  const ordersData = await getAllOrders({ page, query });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="h2-bold">Orders</h2>
        {query && (
            <div className="flex items-center gap-3">
              <p className="text-gray-600">
                Filtered by user <i>&quot;{query}&quot;</i>
              </p>
              <Link href="/admin/orders" className="underline hover:text-gray-700">
                Remove filter
              </Link>
            </div>
          )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>USER</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead className="text-center">PAID</TableHead>
              <TableHead className="text-center">DELIVERED</TableHead>
              <TableHead className="text-center">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersData.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>{order.user?.name || "Deleted user"}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt).dateOnly}
                </TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell className="text-center">
                  {order.isPaid ? (
                    <Badge className="bg-green-800 text-white">Paid</Badge>
                  ) : (
                    <Badge variant="destructive">Not paid</Badge>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {order.isDelivered ? (
                    <Badge className="bg-green-800 text-white">Delivered</Badge>
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