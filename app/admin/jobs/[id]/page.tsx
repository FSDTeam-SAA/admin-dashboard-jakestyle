"use client";

import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  MapPin,
  Clock,
  User,
  Tag,
  Eye,
  FileText,
  BarChart3,
  Globe,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

const fetcher = async (url: string) => {
  const response = await api.get(url);
  return response.data.data;
};

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const { data: job, isLoading } = useSWR(
    jobId ? `/api/v1/jobs/${jobId}` : null,
    fetcher,
  );

  if (isLoading)
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-[600px] rounded-2xl" />
          <Skeleton className="h-[400px] rounded-2xl" />
        </div>
      </div>
    );

  if (!job)
    return (
      <div className="p-20 text-center text-muted-foreground">
        Job post not found.
      </div>
    );

  const homeownerName = job.homeownerId?.name || "Private Homeowner";
  const categoryName = job.categoryId?.name || "General Maintenance";

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full bg-white shadow-sm border-gray-200 hover:text-[#308FAD]"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-[#308FAD] hover:bg-[#308FAD]/90 uppercase text-[10px] tracking-wider">
                  {job.status || "Active"}
                </Badge>
                <span className="text-xs text-muted-foreground font-medium">
                  Ref: {job._id?.slice(-8).toUpperCase()}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                {job.title}
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Overview */}
            <Card className="border-0 shadow-sm overflow-hidden rounded-2xl">
              <CardContent className="p-0">
                <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y md:divide-y-0 border-b">
                  <div className="p-6 flex flex-col items-center text-center gap-2">
                    <MapPin className="w-5 h-5 text-[#308FAD]" />
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">
                      Location
                    </span>
                    <div className="relative group w-full">
                      <p className="text-sm font-semibold truncate w-full">
                        {job.locationText}
                      </p>

                      <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-[320px] -translate-x-1/2 rounded-xl bg-slate-900 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                        {job.locationText}
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col items-center text-center gap-2">
                    <Clock className="w-5 h-5 text-[#308FAD]" />
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">
                      Posted On
                    </span>
                    <p className="text-sm font-semibold">
                      {new Date(job.createdAt).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                  <div className="p-6 flex flex-col items-center text-center gap-2">
                    <User className="w-5 h-5 text-[#308FAD]" />
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">
                      Posted By
                    </span>
                    <p className="text-sm font-semibold">{homeownerName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#308FAD]" />
                  Project Description
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {job.description || "No description provided for this job."}
                </p>
              </CardContent>
            </Card>

            {/* Visual Media Gallery */}
            {job.media?.length > 0 && (
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardHeader className="border-b bg-slate-50/50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#308FAD]" />
                    Job Media{" "}
                    <span className="text-muted-foreground font-normal">
                      ({job.media.length})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {job.media.map((url: string, idx: number) => (
                      <div
                        key={idx}
                        className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 ring-1 ring-slate-200"
                      >
                        <Image
                          src={url}
                          alt="Job context"
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <a
                          href={url}
                          target="_blank"
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                        >
                          <ExternalLink className="w-6 h-6" />
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Metadata Card */}
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle className="text-sm uppercase tracking-widest text-slate-500 font-bold">
                  Metadata
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-sm text-slate-500 flex items-center gap-2">
                      <Tag className="w-4 h-4" /> Category
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {categoryName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-sm text-slate-500 flex items-center gap-2">
                      <Globe className="w-4 h-4" /> Visibility
                    </span>
                    <Badge
                      variant="outline"
                      className="capitalize text-[#308FAD] border-[#308FAD]/30 bg-[#308FAD]/5"
                    >
                      {job.visibility || "Public"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-500 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Admin Mod
                    </span>
                    <span
                      className={`text-sm font-bold ${job.moderatedByAdmin ? "text-emerald-600" : "text-slate-400"}`}
                    >
                      {job.moderatedByAdmin ? "Verified" : "Unverified"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder/Coords */}
            {job.locationGeo?.coordinates && (
              <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-slate-100 group">
                <div className="p-6 space-y-3">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#308FAD]" /> Geographic
                    Data
                  </h3>
                  <div className="text-xs font-mono bg-white p-3 rounded-lg border border-slate-200">
                    LAT: {job.locationGeo.coordinates[1]}
                    <br />
                    LNG: {job.locationGeo.coordinates[0]}
                  </div>
                </div>
                <div className="h-24 bg-slate-200 flex items-center justify-center italic text-slate-400 text-xs">
                  Map Preview Disabled
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
