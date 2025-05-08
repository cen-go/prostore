"use server"

import { z } from "zod";
import { insertReviewSchema } from "@/lib/validators";
import { auth } from "@/auth";
import { getProductById } from "./product.actions";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { Review } from "@/types";

// Create and update reviews
export async function createUpdateReview(
  values: z.infer<typeof insertReviewSchema>
) {
  try {
    const session = await auth();
    if (!session) throw new Error("User is not authenticated!");

    const review = insertReviewSchema.parse(values);
    review.userId = session.user.id;

    const product = await getProductById(review.productId);
    if (!product) throw new Error("Product not found!");

    //check if user has already reviewed the product
    const reviewExists = await prisma.review.findFirst({
      where: {productId: review.productId, userId: review.userId},
    });

    await prisma.$transaction(async (tx) => {
      if (reviewExists) {
        // Update the review
        await tx.review.update({
          where: {id: reviewExists.id},
          data: {
            title: review.title,
            description: review.description,
            rating: review.rating,
          },
        });
      } else {
        // Create the review
        await tx.review.create({data: review});
      }

      // Get average rating
      const averageRating = await tx.review.aggregate({
        _avg: {rating: true},
        where: {productId: review.productId},
      });

      // Get number of reviews
      const reviewsCount = await tx.review.count({
        where: {productId: review.productId}
      });

      // Update rating and number of reviews in Product model
      await tx.product.update({
        where: {id: review.productId},
        data: {
          numReviews: reviewsCount,
          rating: averageRating._avg.rating || 0 ,
        },
      });
    });

    revalidatePath(`/products/${product.slug}`);
    return {success: true, message: "Your review is posted."};

  } catch (error) {
    console.error("Failed to create the review:", error);
    return {success: false, message: "Failed to post the review."};
  }
}

// Get all reviews for a product
export async function getReviews(productId: string): Promise<{data: Review[]}> {
  const data = await prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: { name: true },
      },
    },
    orderBy: {createdAt: "desc"}
  });

  return { data };
}

// Get a review written by the current user
export async function getCurrentUserReview (productId: string) {
  const session = await auth();
  if (!session) throw new Error("Invalid session!");

  return await prisma.review.findFirst({
    where: {
      productId,
      userId: session.user.id,
    }
  });

}