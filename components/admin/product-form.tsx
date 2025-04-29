"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/types";
import slugify from "slugify";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { productDefaultValues } from "@/lib/constants";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { uploadToS3, deleteFromS3 } from "@/lib/actions/s3.actions";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";

export default function ProductForm({
  type,
  product,
  productId,
}: {
  type: "Create" | "Update";
  product?: Product;
  productId?: string;
}) {
  const router = useRouter();

  const form = useForm<
    z.infer<typeof insertProductSchema | typeof updateProductSchema>
  >({
    resolver: zodResolver(
      type === "Update" ? updateProductSchema : insertProductSchema
    ),
    defaultValues:
      type === "Update" && product ? product : productDefaultValues,
  });

  async function onSubmit(
    values:
      | z.infer<typeof insertProductSchema>
      | z.infer<typeof updateProductSchema>
  ) {
    // On Create
    if (type === "Create") {
      const res = await createProduct(values);

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        router.replace("/admin/products");
      }
    }
    // On Update
    if (type === "Update") {
      if (!productId) {
        router.replace("/admin/products");
        return;
      }

      const res = await updateProduct({ ...values, id: productId });

      if (!res.success) {
        toast.error(res.message);
      } else {
        router.replace("/admin/products");
      }
    }
  }

  const isFeatured = form.watch("isFeatured");
  const banner = form.watch("banner");

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row items-start gap-5">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Slug */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Enter slug or generate with button"
                      {...field}
                    />
                    <Button
                      type="button"
                      size="sm"
                      className="bg-gray-600 hover:bg-gray-500 text-white mt-2 rounded-xs font-light"
                      onClick={() => {
                        form.setValue(
                          "slug",
                          slugify(form.getValues("name"), { lower: true })
                        );
                      }}
                    >
                      Generate
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Brand */}
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="Enter brand name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          {/* Category */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Brand */}
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the stock amount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="upload-field flex flex-col gap-5">
          {/* Images */}
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {/* File Input */}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];

                          try {
                            // Call the server action to upload the file
                            const url = await uploadToS3(file);

                            // Append the uploaded image URL to the images field
                            form.setValue("images", [
                              ...(field.value || []),
                              url,
                            ]);
                            toast.success("Image uploaded successfully!");
                          } catch {
                            toast.error("Failed to upload image.");
                          }
                        }
                      }}
                    />

                    {/* Display Uploaded Images */}
                    <div className="flex flex-wrap gap-4 mt-4">
                      {(field.value || []).map((url: string, index: number) => (
                        <div key={url} className="relative">
                          <Image
                            src={url}
                            width={100}
                            height={100}
                            alt={`Uploaded ${index}`}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            className="absolute !text-white -top-2 -right-2 rounded-full text-xs w-4 h-6 font-semibold bg-red-800 hover:bg-red-700"
                            onClick={async () => {
                              // Call server action to remove image from bucket
                              const res = await deleteFromS3(url);
                              // Remove the image URL from the field
                              const updatedImages = field.value.filter(
                                (entry: string, i: number) => i !== index
                              );
                              form.setValue("images", updatedImages);
                              if (!res.success) {
                                toast.error(res.message);
                              } else {
                                toast.success(res.message);
                              }
                            }}
                          >
                            X
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="upload-field">
          {/* isFeatured Field */}
          <Card>
            <CardContent className="space-y-2">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="space-x-2 flex items-center">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel> Is Featured?</FormLabel>
                  </FormItem>
                )}
              />
              {isFeatured && banner && (
                <div className="relative">
                  <Image
                    src={banner}
                    alt="banner image"
                    className="w-full object-cover object-center rounded-sm"
                    width={1920}
                    height={680}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute !text-white -top-3 -right-3 rounded-full  bg-red-800 hover:bg-red-700"
                    onClick={async () => {
                      const url = form.getValues("banner")
                      if (url) {
                        const res = await deleteFromS3(url)
                        if (!res.success) {
                          toast.error(res.message);
                        } else {
                          form.setValue("banner", null);
                          toast.success(res.message);
                        }
                      }
                    }}
                  >
                    X
                  </Button>
                </div>
              )}
              {isFeatured && !banner && (
                <Input
                  type="file"
                  id="banner-input"
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      try {
                        const url = await uploadToS3(file);

                        form.setValue("banner", url);
                        toast.success("Image uploaded successfully!");
                      } catch {
                        toast.error("Failed to upload image.");
                      }
                    }
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          {/* Description */}
          <FormField
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product description..."
                    {...field}
                    className="resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Submitting..." : `${type} Product`}
          </Button>
        </div>
      </form>
    </Form>
  );
}
