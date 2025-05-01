import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { getAllCategories } from "@/lib/actions/product.actions";
import { Menu } from 'lucide-react';
import Link from "next/link";

export default async function CategoryDrawer() {
  const categories = await getAllCategories();

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline" size="lg">
          <Menu />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Select a category</DrawerTitle>
          <div className="space-y-1 mt-4">
            {categories.map((c) => (
              <Button key={c.category} variant="ghost" asChild className="w-full justify-start">
                <DrawerClose asChild>
                  <Link href={`/search/?category=${c.category}`}>{c.category} ({c._count})</Link>
                </DrawerClose>
              </Button>
            ))}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}