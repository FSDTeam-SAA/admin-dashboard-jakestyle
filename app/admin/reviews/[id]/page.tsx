"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import { reviewsAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ChevronLeft, 
  Star, 
  MessageSquare, 
  ShieldCheck, 
  Image as ImageIcon,
  History,
  CheckCircle2,
  XCircle,
  Edit3,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

// Helper to get initials for Avatar fallback
const getInitials = (name: string) => name?.split(" ").map(n => n[0]).join("").toUpperCase() || "??";

const fetcher = async (reviewId: string) => {
  const response = await reviewsAPI.getSingle(reviewId);
  return response.data.data;
};

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
      />
    ))}
  </div>
);

export default function ReviewDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const reviewId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<"approve" | "reject" | "edit" | null>(null);
  const [editedText, setEditedText] = useState("");
  const [adminNote, setAdminNote] = useState("");

  const { data: review, isLoading, mutate } = useSWR(
    reviewId ? ["review", reviewId] : null, 
    () => fetcher(reviewId), 
    {
      onSuccess: (data) => {
        setEditedText(data.adminEditedText || data.text || "");
      },
    }
  );

  const handleAction = async () => {
    if (!action) return toast.error("Please select an action");
    try {
      setLoading(true);
      await reviewsAPI.updateStatus(reviewId, action, action === "edit" ? editedText : undefined, adminNote || undefined);
      toast.success(`Review ${action}ed successfully`);
      mutate();
      setAction(null);
      setAdminNote("");
    } catch (error) {
      toast.error(`Failed to ${action} review`);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div className="p-8"><Skeleton className="h-10 w-48 mb-6" /><Skeleton className="h-[500px] w-full" /></div>;
  if (!review) return <div className="p-8 text-center">Review not found</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Review Moderation</h1>
              <p className="text-xs text-gray-400 uppercase font-semibold">Job: {review.jobId?.title}</p>
            </div>
          </div>
          <StarRating rating={review.stars} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Review Content */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="border-b border-gray-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#308FAD]" />
                  Review Text
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100 relative">
                   <span className="absolute -top-3 left-6 bg-white px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border rounded">Original Text</span>
                   <p className="text-gray-700 leading-relaxed italic">"{review.text}"</p>
                </div>

                {review.completedMedia?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Proof of Work</h4>
                    <div className="flex flex-wrap gap-3">
                      {review.completedMedia.map((media: any) => (
                        <div key={media._id} className="relative w-24 h-24 rounded-lg overflow-hidden border shadow-sm">
                          <Image src={media.url} alt="Work" fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Users Info */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="bg-[#308FAD] h-2" />
              <CardContent className="p-6 space-y-8">
                
                {/* Homeowner (Reviewer) */}
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reviewer (Homeowner)</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border">
                      <AvatarFallback>{getInitials(review.homeownerId?.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{review.homeownerId?.name}</p>
                      <p className="text-xs text-gray-500">{review.homeownerId?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                   <ArrowRight className="text-gray-200 w-5 h-5" />
                </div>

                {/* Tradesperson (Recipient) */}
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reviewed Professional</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={review.tradespersonId?.profileImage?.url} />
                      <AvatarFallback className="bg-slate-100">{getInitials(review.tradespersonId?.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{review.tradespersonId?.name}</p>
                      <p className="text-xs text-gray-500">{review.tradespersonId?.email}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}