'use client';

'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { applicationsAPI } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

const fetchApplications = async (page: number) => {
  const response = await applicationsAPI.getAll(page, 10);
  return response.data.data as any[];
};

const formatDate = (value?: string | null) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString();
};

const formatPrice = (value?: number | null) => {
  if (value === undefined || value === null) return '—';
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    lost: 'bg-red-100 text-red-800',
    withdrawn: 'bg-gray-100 text-gray-800',
  };

  const safe = status || 'pending';

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
        styles[safe] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {safe.charAt(0).toUpperCase() + safe.slice(1)}
    </span>
  );
};

export default function ApplicationsPage() {
  const [page, setPage] = useState(1);

  const { data: applications, isLoading } = useSWR(
    ['applications', page],
    () => fetchApplications(page)
  );

  const ApplicationTableSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 flex-1" />
        </div>
      ))}
    </div>
  );

  const rows = Array.isArray(applications) ? applications : [];

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Applications</h1>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Tradesperson
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Job
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Quote
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Applied
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-6">
                      <ApplicationTableSkeleton />
                    </td>
                  </tr>
                ) : (
                  rows.map((app: any) => {
                    const tradesperson = app.tradespersonId || {};
                    const job = app.jobId || {};

                    return (
                      <tr key={app._id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium">
                            {tradesperson.name || 'N/A'}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {tradesperson.email || 'No email'}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-medium">{job.title || 'N/A'}</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{job.locationText || 'No location'}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm">
                          <div className="font-medium">{formatPrice(app.price)}</div>
                          {app.estimatedStartDate && (
                            <p className="text-xs text-muted-foreground">
                              Start {formatDate(app.estimatedStartDate)}
                            </p>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <StatusBadge status={app.status} />
                        </td>

                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {formatDate(app.createdAt)}
                        </td>

                        <td className="px-6 py-4">
                          <Link href={`/admin/applications/${app._id}`}>
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page + 1)}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
