import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/index";
import ProductPrice from "./product-price";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import Rating from "./rating";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0 items-center">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={300}
            priority
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 pb-2 grid gap-4">
        <div className="text-xs">{product.brand}</div>
        <Link href={`/products/${product.slug}`}>
          <h2 className="text-sm font-medium">{product.name}</h2>
        </Link>
        <div className="flex-between gap-4 flex-wrap">
          <Rating value={Number(product.rating)} caption={product.rating} />
          {product.stock > 0 ? (
            <ProductPrice
              value={Number(product.price)}
              className="font-semibold"
            />
          ) : (
            <p className="text-destructive text-sm">Out of stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
