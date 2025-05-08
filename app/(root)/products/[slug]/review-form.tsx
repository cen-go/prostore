"use client";

import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUpdateReview } from "@/lib/actions/review.actions";
import { insertReviewSchema } from "@/lib/validators";
import { reviewFormDefaultValues } from "@/lib/constants/index";
import { getCurrentUserReview } from "@/lib/actions/review.actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  SelectContent,
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { StarIcon } from "lucide-react";

const ratings = ["1", "2", "3", "4", "5"];

export default function ReviewForm({
  userId,
  productId,
  onReviewSubmitted,
}: {
  userId: string;
  productId: string;
  onReviewSubmitted: () => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  

  const form = useForm<z.infer<typeof insertReviewSchema>>({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: {
      ...reviewFormDefaultValues,
      userId,
      productId,
    },
  });

  async function handleOpenDialog() {
    const review = await getCurrentUserReview(productId);
    if (review) {
      form.setValue("title", review.title);
      form.setValue("description", review.description);
      form.setValue("rating", review.rating);
    }

    setDialogOpen(true);
  }

  // Submit form handler
  async function onSubmit(values: z.infer<typeof insertReviewSchema>) {
    const res = await createUpdateReview(values);
    if (!res.success) {
      return toast.error(res.message);
    }

    setDialogOpen(false);
    onReviewSubmitted();
    toast.success(res.message);
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={handleOpenDialog}>Write a Review</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Write a review</DialogTitle>
          <DialogDescription>
            Share your thoughts with other customers
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a rating" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ratings.map((r) => (
                          <SelectItem key={r} value={r.toString()}>
                            {r} <StarIcon />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <div className="my-8 w-full">
                <Button className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
