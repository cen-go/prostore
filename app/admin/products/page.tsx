import Link from "next/link"
import { Metadata } from "next"
import { requireAdmin } from "@/lib/auth-guard"
import { getAllProducts } from "@/lib/actions/product.actions"
import { Button } from "@/components/ui/button"
import Pagination from "@/components/shared/pagination"
import { Table, TableHeader,TableHead, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { formatCurrency, formatId, formatNumber } from "@/lib/utils"
import DeleteDialog from "@/components/shared/delete-dialog"
import { deleteProduct } from "@/lib/actions/product.actions"

export const metadata: Metadata = {
  title: "Admin Products"
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page: string; query: string; category: string }>;
}) {
  await requireAdmin();
  const queryParams = await searchParams;
  const page = Number(queryParams.page) || 1;
  // const searchText = queryParams.query || "";
  // const category = queryParams.category || "";

  const products = await getAllProducts({ page });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="h2-bold">Products</h1>
        <Button asChild size="sm">
          <Link href="/admin/products/create">Create Product</Link>
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>PRICE</TableHead>
              <TableHead>CATEGORY</TableHead>
              <TableHead>STOCK</TableHead>
              <TableHead>RATING</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.data.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{formatId(product.id)}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{formatCurrency(product.price)}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-center">
                  {formatNumber(product.stock)}
                </TableCell>
                <TableCell className="text-center">{product.rating}</TableCell>
                <TableCell className="text-right flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/products/${product.id}/edit`}>Edit</Link>
                  </Button>
                  <DeleteDialog id={product.id} action={deleteProduct} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {products.totalPages > 1 && (
          <Pagination page={page || 1} totalPages={products.totalPages} />
        )}
      </div>
    </div>
  );
}