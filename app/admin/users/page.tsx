import { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth-guard";
import { getAllUsers,deleteUser } from "@/lib/actions/user.actions";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/shared/pagination";
import { formatId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DeleteDialog from "@/components/shared/delete-dialog";

export const metadata: Metadata = {
  title: "Users",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page: string; query: string; }>;
}) {
  await requireAdmin();

  const queryParams = await searchParams;

  const page = Number(queryParams.page) || 1;
  const query = queryParams.query || "";

  const data = await getAllUsers({ page, query });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="h2-bold">Users</h2>
        {query && (
            <div className="flex items-center gap-3">
              <p className="text-gray-600">
                Filtered by name <i>&quot;{query}&quot;</i>
              </p>
              <Link href="/admin/users" className="underline hover:text-gray-700">
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
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead className="text-center">ROLE</TableHead>
              <TableHead className="text-center">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{formatId(user.id)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="text-center">
                  {user.role === "user" ? (
                    <Badge variant="outline">User</Badge>
                  ): (
                    <Badge className="bg-sky-200 text-black">Admin</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/users/${user.id}`}>Edit</Link>
                  </Button>
                  <DeleteDialog id={user.id} action={deleteUser} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {data.totalPages > 1 && (
          <Pagination page={page} totalPages={data.totalPages} />
        )}
      </div>
    </div>
  );
}
