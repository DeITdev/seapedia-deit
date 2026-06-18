import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StarRating } from "@/components/reviews/star-rating";
import { ReviewForm } from "@/components/reviews/review-form";
import { db } from "@/lib/db";

interface ReviewItem {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

async function getReviews(): Promise<ReviewItem[]> {
  try {
    return await db.applicationReview.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
    });
  } catch {
    // Degrade gracefully if the database is not configured yet.
    return [];
  }
}

export async function ReviewSection() {
  const reviews = await getReviews();

  return (
    <section id="reviews" className="scroll-mt-20">
      <div className="mb-6 space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          What people say about SEAPEDIA
        </h2>
        <p className="text-muted-foreground text-sm">
          Share your experience with the app — no account or purchase required.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {reviews.length === 0 ? (
            <p className="text-muted-foreground col-span-full text-sm">
              No reviews yet. Be the first to leave one!
            </p>
          ) : (
            reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/15 text-primary text-sm font-semibold">
                        {review.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      {/* Rendered as escaped text by React (XSS-safe). */}
                      <p className="text-sm font-medium">{review.name}</p>
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm whitespace-pre-line">
                    {review.comment}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Leave a review</CardTitle>
          </CardHeader>
          <CardContent>
            <ReviewForm />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
