"use client"

import { useState, useEffect } from "react";
import { Review } from "@/types";
import Link from "next/link";
import { getReviews } from "@/lib/actions/review.actions";
import ReviewForm from "./review-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import Rating from "@/components/shared/product/rating";

export default function ReviewList({
  userId,
  productId,
  productSlug,
}: {
  userId: string;
  productId: string;
  productSlug: string;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    async function loadReviews() {
      const res = await getReviews(productId);
      setReviews(res.data);
    }

    loadReviews();
  }, [productId])

  async function reload() {
    const res = await getReviews(productId);
    setReviews([...res.data]);
  }

  return (
    <div className="space-y-4">
      {reviews.length === 0 && <div>This product has no reviews yet.</div>}
      {userId ? (
        <ReviewForm
          userId={userId}
          productId={productId}
          onReviewSubmitted={reload}
        />
      ) : (
        <div>
          Please
          <Link
            href={`/sign-in?callbackUrl=/products/${productSlug}`}
            className="text-blue-700 px-1"
          >
            sign in
          </Link>
          to write a review.
        </div>
      )}
      <div className="flex flex-col gap-2">
        {reviews.map(review => (
          <Card key={review.id}>
            <CardHeader className="space-y-2">
                <CardTitle>{review.title}</CardTitle>
                <CardDescription className="text-gray-700">{review.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-5 text-sm text-muted-foreground">
                <Rating value={review.rating} />
                <div className="flex items-start gap-1">
                  <User className="w-4 h-4" />
                  {review.user?.name || "user"}
                </div>
                <div className="flex items-start gap-1">
                  <Calendar className="w-4 h-4"/>
                  {formatDateTime(review.createdAt).dateTime}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
    </div>
  );
}