import { Metadata } from "next"
import { auth } from "@/auth";
import { getOrdersSummary } from "@/lib/actions/order.actions"
import { redirect } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { BadgeDollarSign, BarcodeIcon, CreditCardIcon, Users } from "lucide-react";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/utils";
import { Table, TableHeader, TableHead, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminOverviewPage() {
  const session = await auth();

  if (!session) throw new Error("Invalid session");
  if (session.user.role !== "admin") {
    return redirect("/sign-in");
  }

  const summary = await getOrdersSummary();

  return (
    <div className="space-y-2">
      <h1 className="h2-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BadgeDollarSign />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(Number(summary.totalSales._sum.totalPrice) || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <CreditCardIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.ordersCount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.usersCount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <BarcodeIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.productsCount)}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardContent>CHARTS</CardContent>
          </CardHeader>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>BUYER</TableHead>
                    <TableHead>DATE</TableHead>
                    <TableHead className="text-center">TOTAL</TableHead>
                    <TableHead className="text-right">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.latestSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.user.name}</TableCell>
                      <TableCell>
                        {formatDateTime(sale.createdAt).dateOnly}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatCurrency(sale.totalPrice)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/order/${sale.id}`} className="underline">Details</Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}