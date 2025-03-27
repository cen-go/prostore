import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ProductPrice from "@/components/shared/product/product-price";
import ProductImages from "@/components/shared/product/product-images";
import { getProductBySlug } from "@/lib/actions/product.actions";
import AddToCart from "@/components/shared/product/add-to-cart";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return notFound();
  }

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Images Column */}
          <div className="col-span-2">
            <ProductImages images={product.images} />
          </div>
          {/* Details column */}
          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-6">
              <p>
                {product.brand} {product.category}
              </p>
              <h1 className="h3-bold">{product.name}</h1>
              <p>
                {product.rating} of {product.numReviews} reviews
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <ProductPrice
                  value={Number(product.price)}
                  className="w-24 py-2 rounded-full bg-green-100 text-green-700 font-medium text-center"
                />
              </div>
            </div>
            <div className="mt-10">
              <p className="font-semibold">Description</p>
              <p>{product.description}</p>
            </div>
          </div>
          {/* Action Column */}
          <div>
            <Card>
              <CardContent className="px-4 py-0">
                <div className="mb-2 flex justify-between">
                  <div>Price</div>
                  <div>
                    <ProductPrice value={Number(product.price)} />
                  </div>
                </div>
                <div className="mb-2 flex justify-between">
                  <div>Status</div>
                  <div>
                    {product.stock > 0 ? (
                      <Badge variant="outline">In stock</Badge>
                    ) : (
                      <Badge variant="destructive">Out of stock</Badge>
                    )}
                  </div>
                </div>
                {product.stock > 0 && (
                  <div className="flex-center">
                    <AddToCart
                      item={{
                        id: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        image: product.images[0],
                        qnty: 1,
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
