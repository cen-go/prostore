import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth-guard";
import { getProductById } from "@/lib/actions/product.actions";
import ProductForm from "@/components/admin/product-form";

export const metadata: Metadata = {
  title: "Update Product",
}

export default async function AdminProductUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const {id} = await params;
  const product = await getProductById(id);

  if (!product) throw new Error("Product not found!");

  return (
    <div className="space-y-8 mx-auto">
      <h2 className="h2-bold">Update Product</h2>
      <ProductForm type="Update" product={product} productId={id} />
    </div>
  );
}
