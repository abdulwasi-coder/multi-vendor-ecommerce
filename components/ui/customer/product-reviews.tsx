<|open|>argument key="content" type="string"<|sep|>"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/axios";
import { getCustomerProfile } from "@/lib/customer-profile";

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
  viewerId: string;
  currentPage: number;
  totalPages: number;
  total: number;
  reviews: ApiReview[];
};

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const pathname = usePathname();
  const { data: user, isPending: isProfilePending } = useQuery({
    queryKey: ["customer-account-profile"],
    queryFn: getCustomerProfile,
    enabled: expanded,
    staleTime: 300_000,
    refetchOnWindowFocus: false,
  });

  const { data, isPending, isError } = useQuery({
    queryKey: ["product-reviews", productId, page],
    enabled: expanded && !!user,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
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
        error as { response?: { status?: number; data?: { message?: string } } }
      )?.response;
      if (apiMessage?.status === 409) {
        toast.info("You already reviewed this product — use Edit on your review below.");
      } else {
        toast.error(apiMessage?.data?.message ?? "Could not post your review.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(review: ApiReview) {
    setEditingId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment ?? "");
  }

  async function submitEdit() {
    if (!editingId || editRating < 1) {
      toast.error("Please select a star rating.");
      return;
    }
    setEditSubmitting(true);
    try {
      await api.patch(`/user/reviews/${editingId}`, {
        rating: editRating,
        comment: editComment.trim() || "",
      });
      toast.success("Review updated.");
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });
    } catch (error) {
      const apiMessage = (
        error as { response?: { data?: { message?: string } } }
      )?.response?.data?.message;
      toast.error(apiMessage ?? "Could not update your review.");
    } finally {
      setEditSubmitting(false);
    }
  }

  function confirmDelete(reviewId: string) {
    toast("Delete your review?", {
      description: "This cannot be undone.",
      duration: 6000,
      action: {
        label: "Delete",
        onClick: () => void removeReview(reviewId),
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  }

  async function removeReview(reviewId: string) {
    setDeletingId(reviewId);
    try {
      await api.delete(`/user/reviews/${reviewId}`);
      toast.success("Review deleted.");
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });
    } catch (error) {
      const apiMessage = (
        error as { response?: { data?: { message?: string } } }
      )?.response?.data?.message;
      toast.error(apiMessage ?? "Could not delete your review.");
    } finally {
      setDeletingId(null);
    }
  }

  const displayRating = initialRating;
  const displayCount = initialCount;

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

          {(isProfilePending || (user && isPending)) && (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-md bg-muted/50" />
              ))}
            </div>
          )}

          {!isProfilePending && !user && (
            <div className="rounded-md border bg-muted/30 px-4 py-6 text-center">
              <p className="text-sm text-muted-foreground">
                Sign in to view and write reviews.
              </p>
              <Link
                href={`/login?redirect=${encodeURIComponent(pathname)}`}
                className="mt-3 inline-flex h-9 items-center rounded-full bg-[#ffd814] px-4 text-sm font-normal text-[#0f1111] hover:bg-[#f7ca00]"
              >
                Sign in
              </Link>
            </div>
          )}

          {isError && (
            <p className="py-4 text-sm text-muted-foreground">
              Could not load reviews. Please try again.
            </p>
          )}

          {data && data.reviews.length === 0 && (
            <p className="py-4 text-sm text-muted-foreground">
              No reviews yet. Only customers who purchased this product can write a review.
            </p>
          )}

          {data && data.reviews.length > 0 && (
            <ul className="space-y-4">
              {data.reviews.map((review) => {
                const isOwner =
                  !!user?._id &&
                  typeof review.user === "object" &&
                  review.user?._id === user._id;
                const editing = editingId === review._id;
                return (
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
                    {isOwner && !editing && (
                      <span className="ml-auto flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(review)}
                          className="text-xs font-medium text-[#007185] hover:text-[#c45500] hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmDelete(review._id)}
                          disabled={deletingId === review._id}
                          className="text-xs font-medium text-[#007185] hover:text-[#c45500] hover:underline disabled:opacity-50"
                        >
                          {deletingId === review._id ? "Deleting..." : "Delete"}
                        </button>
                      </span>
                    )}
                  </div>
                  {editing ? (
                    <div className="mt-2 rounded-md border bg-muted/30 p-3">
                      <div className="mb-2 flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setEditRating(star)}
                            aria-label={`${star} star${star === 1 ? "" : "s"}`}
                            className="p-0.5"
                          >
                            <Star
                              size={18}
                              className={editRating >= star ? "fill-[#e77600] text-[#e77600]" : "fill-[#e3e6e6] text-[#e3e6e6]"}
                            />
                          </button>
                        ))}
                      </div>
                      <Textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        placeholder="Share your experience (optional)"
                        maxLength={1000}
                        rows={2}
                        className="mb-2"
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          onClick={submitEdit}
                          disabled={editSubmitting}
                          className="h-8 rounded-full bg-[#ffd814] px-3 text-xs font-normal text-[#0f1111] hover:bg-[#f7ca00]"
                        >
                          {editSubmitting ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setEditingId(null)}
                          className="h-8 rounded-full text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    review.comment && (
                      <p className="mt-1.5 text-sm text-muted-foreground">{review.comment}</p>
                    )
                  )}
                </li>
                );
              })}
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
