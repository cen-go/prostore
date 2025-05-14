import Link from "next/link";

import ThemeToggle from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { ShoppingCart, EllipsisVertical } from "lucide-react";
import UserButton from "./user-button";
import {
  Sheet,
  SheetTrigger,
  SheetTitle,
  SheetContent,
  SheetDescription,
} from "@/components/ui/sheet";
import { getMyCart } from "@/lib/actions/cart.actions";

export default async function Menu() {
  const cart = await getMyCart()
  let cartCount = 0;
  if (cart) {
    cartCount = cart.items.reduce((sum, item) => sum += item.qnty, 0)
  }

  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ThemeToggle />
        <Button asChild variant="outline" className="mr-3">
          <Link href="/cart">
            <ShoppingCart /> Cart{" "}
            {cartCount > 0 && (
              <span className="bg-amber-400 text-black w-6 h-6 text-center text-xs  p-1 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </Button>
        <UserButton />
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle cursor-pointer">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start p-6">
            <SheetTitle>Menu</SheetTitle>
            <ThemeToggle />
            <Button asChild variant="outline">
              <Link href="/cart">
                <ShoppingCart /> Cart{" "}
                {cartCount > 0 && (
                  <span className="bg-amber-400 text-black w-6 h-6 text-center text-xs p-1 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>
            <UserButton />
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
