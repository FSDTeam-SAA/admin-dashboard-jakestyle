'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import api, { jobsAPI } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, ChevronLeft, ChevronRight, Badge } from 'lucide-react';

const fetcher = async (url: string) => {
  const response = await api.get(url);
  return response.data.data;
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    open_to_quotes: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
};

export default function JobsPage() {
  const [page, setPage] = useState(1);

  const { data: jobs, isLoading } = useSWR(
    `/api/v1/jobs/near-you?page=${page}&limit=10`,
    fetcher
  );

  const JobTableSkeleton = () => (
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
        <h1 className="text-3xl font-bold">All Jobs</h1>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Posted Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-6">
                      <JobTableSkeleton />
                    </td>
                  </tr>
                ) : jobs && Array.isArray(jobs) ? (
                  jobs.map((job: any) => (
                    <tr key={job._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium max-w-xs truncate">{job.title}</td>
                      <td className="px-6 py-4 text-sm">{job.category?.name || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={job.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/admin/jobs/${job._id}`}>
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : null}
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
