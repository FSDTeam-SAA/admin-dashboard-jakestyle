'use client';

import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import api, { jobsAPI } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, MapPin, Clock, User } from 'lucide-react';

const fetcher = async (url: string) => {
  const response = await api.get(url);
  return response.data.data;
};

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const { data: job, isLoading } = useSWR(`/api/v1/jobs/${jobId}`, fetcher);

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Skeleton className="h-8 w-40" />
        </div>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-8 space-y-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Job not found</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-bold">Job Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 space-y-4">
              <h2 className="text-2xl font-bold">{job.title}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {job.locationText}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {new Date(job.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {job.homeownerId}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 space-y-4">
              <h3 className="text-lg font-bold">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
            </CardContent>
          </Card>

          {/* Media Gallery */}
          {job.media && job.media.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 space-y-4">
                <h3 className="text-lg font-bold">Media</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {job.media.map((url: string, idx: number) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Job media ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Info */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold">Job Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium capitalize">{job.status.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{job.category?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Visibility</span>
                  <span className="font-medium capitalize">{job.visibility}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Moderated</span>
                  <span className="font-medium">{job.moderatedByAdmin ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold">Statistics</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quotes</span>
                  <span className="font-medium">{job.quotes || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Views</span>
                  <span className="font-medium">{job.views || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Applications</span>
                  <span className="font-medium">{job.applications || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
