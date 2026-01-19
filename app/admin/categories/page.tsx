"use client";

import { useState } from "react";
import useSWR from "swr";
import api, { categoriesAPI } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
  MousePointerClick,
} from "lucide-react";
import { toast } from "sonner";
import DeleteModal from "@/components/DeleteModal";

const fetcher = async (url: string) => {
  const response = await api.get(url);
  return response.data.data;
};

/* ================= STATUS BADGE ================= */
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const icons: Record<string, JSX.Element> = {
    pending: <Clock className="w-3 h-3" />,
    approved: <CheckCircle className="w-3 h-3" />,
    rejected: <XCircle className="w-3 h-3" />,
  };

  const safe = status || "pending";

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
        styles[safe] || "bg-gray-100 text-gray-800"
      }`}
    >
      {icons[safe]}
      {safe.charAt(0).toUpperCase() + safe.slice(1)}
    </span>
  );
};

/* ================= PAGE ================= */
export default function CategoriesPage() {
  const [page, setPage] = useState(1);

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    categoryId?: string;
  }>({ open: false });

  const [statusModal, setStatusModal] = useState<{
    open: boolean;
    categoryId?: string;
    current?: string;
    name?: string;
  }>({ open: false });

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const {
    data: categories,
    isLoading,
    mutate,
  } = useSWR(`/api/v1/admin/categories?page=${page}&limit=10`, fetcher);

  /* ================= DELETE ================= */
  const handleDelete = async (categoryId: string) => {
    try {
      await categoriesAPI.delete(categoryId);
      toast.success("Category deleted successfully");
      await mutate();
      setDeleteModal({ open: false });
    } catch {
      toast.error("Failed to delete category");
    }
  };

  /* ================= STATUS UPDATE ================= */
const handleUpdateStatus = async (
  categoryId: string,
  status: "pending" | "approved" | "rejected"
) => {
  try {
    setIsUpdatingStatus(true);

    await categoriesAPI.updateStatus(categoryId, status);

    toast.success("Category status updated");
    await mutate();
    setStatusModal({ open: false });
  } catch {
    toast.error("Failed to update status");
  } finally {
    setIsUpdatingStatus(false);
  }
};


  /* ================= SKELETON ================= */
  const CategoryTableSkeleton = () => (
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
      <h1 className="text-3xl font-bold">Categories</h1>

      <Card className="border-0 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Status (Change by clicking)
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="p-6">
                      <CategoryTableSkeleton />
                    </td>
                  </tr>
                ) : Array.isArray(categories) ? (
                  categories.map((cat: any) => (
                    <tr key={cat._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{cat.name}</td>

                      {/* CLICKABLE STATUS */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            setStatusModal({
                              open: true,
                              categoryId: cat._id,
                              current: cat.status,
                              name: cat.name,
                            })
                          }
                          className="group flex items-center gap-2 px-2 py-1 rounded-md transition-all hover:bg-slate-50 active:scale-95 cursor-pointer"
                          title="Change Status"
                        >
                          {/* Status Badge */}
                          <StatusBadge status={cat.status} />

                          {/* Click Icon - Only visible/colored on hover to keep UI clean */}
                          <MousePointerClick className="w-4 h-4 text-slate-400 transition-colors group-hover:text-[#308FAD]" />
                        </button>
                      </td>

                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(cat.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                          onClick={() =>
                            setDeleteModal({ open: true, categoryId: cat._id })
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* PAGINATION */}
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {Array.from({ length: 3 }).map((_, i) => (
          <Button
            key={i}
            size="sm"
            variant={page === i + 1 ? "default" : "outline"}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}

        <Button size="sm" variant="outline" onClick={() => setPage(page + 1)}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* DELETE MODAL */}
      <DeleteModal
        isOpen={deleteModal.open}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        onConfirm={() =>
          deleteModal.categoryId && handleDelete(deleteModal.categoryId)
        }
        onCancel={() => setDeleteModal({ open: false })}
      />

      {/* STATUS MODAL */}
      {statusModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-2 text-center">
              Update Status
            </h3>
            <p className="text-slate-500 mb-6 text-center">
              {statusModal.name} is currently{" "}
              <span className="font-semibold">{statusModal.current}</span>
            </p>

            <div className="flex flex-col gap-3">
              <Button
                disabled={isUpdatingStatus}
                onClick={() =>
                  statusModal.categoryId &&
                  handleUpdateStatus(statusModal.categoryId, "approved")
                }
              >
                Approve
              </Button>

              <Button
                variant="ghost"
                onClick={() => setStatusModal({ open: false })}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
