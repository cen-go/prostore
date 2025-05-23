import Link from "next/link";
import { auth } from "@/auth";
import { SignOutUser } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { UserIcon } from "lucide-react";

export default async function UserButton() {
  const session = await auth();

  if (!session) {
    return (
      <Button asChild>
        <Link href="/sign-in">
          <UserIcon /> Sign In
        </Link>
      </Button>
    );
  }

  const firstUserNameInitial =
    session.user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="relative w-9 h-9 rounded-full flex items-center justify-center font-medium text-lg text-slate-950 bg-sky-200 hover:bg-sky-300"
            >
              {firstUserNameInitial}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1 px-1.5">
              <div className="text-sm font-medium leading-none">
                {session.user?.name}
              </div>
              <div className="text-sm text-muted-foreground leading-none">
                {session.user?.email}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem className="p-0">
            <Button variant="ghost" asChild className="w-full justify-start">
              <Link href="/user/profile">User Profile</Link>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0">
            <Button variant="ghost" asChild className="w-full justify-start">
              <Link href="/user/orders">Order History</Link>
            </Button>
          </DropdownMenuItem>
          {session.user?.role === "admin" && (
            <DropdownMenuItem className="p-0">
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link href="/admin/overview">Admin</Link>
              </Button>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="p-0">
            <Button
              variant="ghost"
              onClick={SignOutUser}
              className="w-full justify-start"
            >
              Sign Out
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
