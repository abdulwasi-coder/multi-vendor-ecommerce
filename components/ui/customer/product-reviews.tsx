"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/axios";

type ReviewUser = { _id: string; name?: string } | string;

type ApiReview = {
  _id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user: ReviewUser;
};

type ReviewsResponse = {
  success: boolean;
  rating: number;
  reviewCount: number;
  currentPage: number;
  totalPages: number;
  total: number;
  reviews: ApiReview[];
};

type UserProfileResponse = {
  success?: boolean;
  userData?: { name?: string };
};

async function getCustomerProfile() {
  const response = await fetch("/proxy-backend/user/userProfile", {
    credentials: "include",
  });
  if (!response.ok) return null;
  const result = (await response.json()) as UserProfileResponse;
  return result.success ? (result.userData ?? null) : null;
}

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= Math.round(value) ? "fill-[#e77600] text-[#e77600]" : "fill-[#e3e6e6] text-[#e3e6e6]"}
        />
      ))}
    </span>
  );
}

function reviewerName(user: ReviewUser) {
  return typeof user === "object" && user?.name ? user.name : "Customer";
}

export function ProductReviews({
  productId,
  initialRating = 0,
  initialCount = 0,
}: {
  productId: string;
  initialRating?: number;
  initialCount?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["customer-account-profile"],
    queryFn: getCustomerProfile,
    staleTime: 60_000,
  });

  const { data, isPending, isError } = useQuery({
    queryKey: ["product-reviews", productId, page],
    enabled: expanded,
    staleTime: 60_000,
    queryFn: async () => {
      const response = await api.get<ReviewsResponse>(
        `/user/products/${productId}/reviews`,
        { params: { page, limit: 10 } },
      );
      return response.data;
    },
  });

  async function submitReview() {
    if (rating < 1) {
      toast.error("Please select a star rating.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/user/reviews", {
        productID: productId,
        rating,
        comment: comment.trim() || undefined,
      });
      toast.success("Thanks! Your review was posted.");
      setShowForm(false);
      setRating(0);
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });
    } catch (error) {
      const apiMessage = (
        error as { response?: { data?: { message?: string } } }
      )?.response?.data?.message;
      toast.error(apiMessage ?? "Could not post your review.");
    } finally {
      setSubmitting(false);
    }
  }

  const displayRating = data?.rating ?? initialRating;
  const displayCount = data?.reviewCount ?? initialCount;

  return (
    <div className="mt-4 rounded-lg border">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        aria-expanded={expanded}
      >
        <span className="flex items-center gap-2 text-sm">
          <Stars value={displayRating} />
          <span className="font-semibold">{displayRating.toFixed(1)}</span>
          <span className="text-muted-foreground">
            {displayCount} rating{displayCount === 1 ? "" : "s"}
          </span>
        </span>
        <span className="flex items-center gap-1 text-sm font-medium text-[#007185]">
          {expanded ? "Hide reviews" : "View reviews"}
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {expanded && (
        <div className="border-t px-4 py-4">
          {user && !showForm && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(true)}
              className="mb-4 h-9 rounded-full text-sm"
            >
              Write a review
            </Button>
          )}

          {showForm && (
            <div className="mb-5 rounded-md border bg-muted/30 p-4">
              <p className="mb-2 text-sm font-semibold">Your review</p>
              <div className="mb-3 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    aria-label={`${star} star${star === 1 ? "" : "s"}`}
                    className="p-0.5"
                  >
                    <Star
                      size={22}
                      className={(hoverRating || rating) >= star ? "fill-[#e77600] text-[#e77600]" : "fill-[#e3e6e6] text-[#e3e6e6]"}
                    />
                  </button>
                ))}
              </div>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience (optional)"
                maxLength={1000}
                rows={3}
                className="mb-3"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={submitReview}
                  disabled={submitting}
                  className="h-9 rounded-full bg-[#ffd814] px-4 text-sm font-normal text-[#0f1111] hover:bg-[#f7ca00]"
                >
                  {submitting ? "Posting..." : "Submit review"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                  className="h-9 rounded-full text-sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {isPending && (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-md bg-muted/50" />
              ))}
            </div>
          )}

          {isError && (
            <p className="py-4 text-sm text-muted-foreground">
              Could not load reviews. Please try again.
            </p>
          )}

          {data && data.reviews.length === 0 && (
            <p className="py-4 text-sm text-muted-foreground">
              No reviews yet — be the first to share your experience.
            </p>
          )}

          {data && data.reviews.length > 0 && (
            <ul className="space-y-4">
              {data.reviews.map((review) => (
                <li key={review._id} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <Stars value={review.rating} />
                    <span className="text-sm font-semibold">{reviewerName(review.user)}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="mt-1.5 text-sm text-muted-foreground">{review.comment}</p>
                  )}
                </li>
              ))}
            </ul>
          )}

          {data && data.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {data.currentPage} of {data.totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
