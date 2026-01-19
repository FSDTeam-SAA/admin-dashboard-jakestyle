"use client";

import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { applicationsAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  Calendar,
  MapPin,
  FileText,
  Link as LinkIcon,
  User,
  DollarSign,
  Clock,
  Briefcase,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const fetcher = async (applicationId: string) => {
  const response = await applicationsAPI.getSingle(applicationId);
  return response.data.data;
};

const formatDate = (value?: string | null, withTime = false) => {
  if (!value) return "—";
  const date = new Date(value);
  return withTime ? date.toLocaleString() : date.toLocaleDateString();
};

const formatPrice = (value?: number | null) => {
  if (value === undefined || value === null) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-600 border-amber-200",
    active: "bg-emerald-50 text-emerald-600 border-emerald-200",
    lost: "bg-rose-50 text-rose-600 border-rose-200",
    withdrawn: "bg-slate-50 text-slate-600 border-slate-200",
  };

  const safe = status?.toLowerCase() || "pending";

  return (
    <span
      className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border ${
        styles[safe] || "bg-gray-50 text-gray-600 border-gray-200"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-2 bg-current animate-pulse`} />
      {safe.toUpperCase()}
    </span>
  );
};

export default function ApplicationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const { data: application, isLoading } = useSWR(
    applicationId ? ["application", applicationId] : null,
    () => fetcher(applicationId),
  );

  if (isLoading) {
    return (
      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!application) return <div className="p-8 text-center">Application not found</div>;

  const job = application.jobId || {};
  const tradesperson = application.tradespersonId || {};
  const relatedFiles: string[] = application.relatedFiles || [];
  const initials = (tradesperson.name || "TP").split(" ").map((n: string) => n[0]).join("").toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className=" space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => router.back()}
              className="rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">Application Details</h1>
                <StatusBadge status={application.status} />
              </div>
              <p className="text-gray-500 mt-1 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {job.title} <span className="text-gray-300">|</span> <MapPin className="w-4 h-4" /> {job.locationText}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Quoted Price", value: formatPrice(application.price), icon: DollarSign, color: "text-emerald-600" },
                { label: "Est. Start Date", value: formatDate(application.estimatedStartDate), icon: Calendar, color: "text-[#308FAD]" },
                { label: "Submission Date", value: formatDate(application.createdAt), icon: Clock, color: "text-slate-600" }
              ].map((stat, i) => (
                <Card key={i} className="border-0 shadow-sm overflow-hidden">
                  <div className="p-5 flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{stat.label}</p>
                      <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Application Information */}
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardHeader className="border-b border-gray-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#308FAD]" />
                  Professional&apos;s Proposal
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  {application.additionalInfo || "No cover letter or additional information provided."}
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-tight flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-[#308FAD]" />
                    Project Attachments ({relatedFiles.length})
                  </h4>
                  {relatedFiles.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {relatedFiles.map((file, i) => (
                        <div key={i} className="group relative rounded-xl overflow-hidden border border-gray-200 hover:border-[#308FAD] transition-all cursor-pointer">
                          <Image src={file} alt="Attachment" width={100} height={100} className="object-cover h-24 w-24 group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <LinkIcon className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No attachments provided.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Job Context */}
            <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
              <div className="h-2 bg-[#308FAD]" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-lg font-bold flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#308FAD]" />
                    Original Job Posting
                  </h3>
                  <Button variant="link" className="text-[#308FAD] p-0">View Full Job</Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-2">
                  {[
                    { label: "Job ID", value: `#${application._id?.slice(-6)}` },
                    { label: "Status", value: job.status?.replace(/_/g, " "), capitalize: true },
                    { label: "Visibility", value: job.visibility, capitalize: true },
                    { label: "City/Region", value: job.locationText }
                  ].map((item, i) => (
                    <div key={i}>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                      <p className={`text-sm font-semibold text-gray-700 ${item.capitalize ? 'capitalize' : ''}`}>
                        {item.value || "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm rounded-2xl sticky top-8">
              <CardHeader className="text-center pb-2">
                <div className="relative mx-auto w-24 h-24 mb-4">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                    <AvatarImage src={tradesperson.profileImage?.url} />
                    <AvatarFallback className="bg-[#308FAD] text-white text-2xl">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full" />
                </div>
                <CardTitle className="text-xl">{tradesperson.name}</CardTitle>
                <p className="text-sm text-gray-500">{tradesperson.email}</p>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="flex justify-center gap-2">
                  <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-blue-100 capitalize">
                    {tradesperson.role || "Professional"}
                  </Badge>
                  <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-emerald-100 capitalize">
                    {tradesperson.accountStatus || "Verified"}
                  </Badge>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Member Since
                    </span>
                    <span className="font-medium">{formatDate(tradesperson.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-2">
                      <User className="w-4 h-4" /> Account Type
                    </span>
                    <span className="font-medium capitalize">{tradesperson.role}</span>
                  </div>
                </div>

                <Button className="w-full bg-[#308FAD] hover:bg-[#26738c] shadow-lg shadow-blue-100/50 h-11">
                  View Full Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}