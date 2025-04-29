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
  searchParams: Promise<{ page: string }>;
}) {
  await requireAdmin();

  const queryParams = await searchParams;

  const page = Number(queryParams.page) || 1;

  const data = await getAllUsers({ page });

  return (
    <div className="space-y-4">
      <h2 className="h2-bold">Users</h2>
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
                    <Badge className="bg-amber-400 text-black">Admin</Badge>
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
