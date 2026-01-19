'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import api from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const fetcher = async (url: string) => {
  const response = await api.get(url);
  // Your API: { success, message, data: [...] }
  return response.data.data as any[];
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    edited: 'bg-blue-100 text-blue-800',
  };

  const safe = status || 'pending';

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
        styles[safe as keyof typeof styles] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {safe.charAt(0).toUpperCase() + safe.slice(1)}
    </span>
  );
};

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))}
  </div>
);

export default function ReviewsPage() {
  const [page, setPage] = useState(1);

  const { data: reviews, isLoading } = useSWR(
    `/api/v1/admin/reviews?page=${page}&limit=10`,
    fetcher
  );

  const ReviewTableSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 flex-1" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reviews</h1>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Reviewer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Rating</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Review Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-6">
                      <ReviewTableSkeleton />
                    </td>
                  </tr>
                ) : Array.isArray(reviews) ? (
                  reviews.map((review: any) => {
                    const rating = Number(review.stars ?? 0);
                    const reviewerLabel =
                      review.reviewerName ||
                      review.homeownerName ||
                      review.tradespersonName ||
                      review.homeownerId?.name ||
                      review.tradespersonId?.name ||
                      (typeof review.homeownerId === 'string'
                        ? review.homeownerId
                        : '') ||
                      'Anonymous';

                    return (
                      <tr key={review._id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{reviewerLabel}</td>

                        <td className="px-6 py-4">
                          <StarRating rating={rating} />
                        </td>

                        <td className="px-6 py-4">
                          {/* status isn't in your response, so default it */}
                          <StatusBadge status={review.status || 'pending'} />
                        </td>

                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : '-'}
                        </td>

                        <td className="px-6 py-4">
                          <Link href={`/admin/reviews/${review._id}`}>
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination (still naive without totalPages from API) */}
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {Array.from({ length: 3 }).map((_, i) => (
          <Button
            key={i + 1}
            variant={page === i + 1 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}

        <Button variant="outline" size="sm" onClick={() => setPage(page + 1)}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
