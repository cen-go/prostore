import { Metadata } from "next"
import { requireAdmin } from "@/lib/auth-guard"
import { getUserById } from "@/lib/data/getUser"
import { notFound } from "next/navigation";
import UpdateUserForm from "./update-user-form";

export const metadata: Metadata = {
  title: "Edit User",
}

export default async function AdminUserUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;

  const user = await getUserById(id);

  if (!user) notFound();
  

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h1 className="h2-bold text-center">Update User</h1>
      <UpdateUserForm user={user} />
    </div>
  );
}