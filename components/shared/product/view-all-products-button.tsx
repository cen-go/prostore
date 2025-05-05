import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ViewAllProductsButton() {
  return (
    <div className="flex-center my-6">
    <Button asChild className="px-8 py-4 text-lg font-semibold">
      <Link href="/search">View All Products</Link>
    </Button>

    </div>
  )
}