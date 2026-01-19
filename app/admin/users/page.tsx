'use client';

import { useState } from 'react';
import useSWR from 'swr';
import api, { usersAPI } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2, ChevronLeft, ChevronRight, LogOut, MousePointerClick } from 'lucide-react';
import { toast } from 'sonner';
import DeleteModal from '@/components/DeleteModal';

const fetcher = async (url: string) => {
  const response = await api.get(url);
  return response.data.data;
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    suspended: 'bg-gray-200 text-gray-800',
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

export default function UsersPage() {
  const [page, setPage] = useState(1);

  const [deleteModal, setDeleteModal] = useState<{ open: boolean; userId?: string }>({
    open: false,
  });

  const [statusModal, setStatusModal] = useState<{
    open: boolean;
    userId?: string;
    current?: string;
    name?: string;
  }>({ open: false });

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const { data: users, isLoading, mutate } = useSWR(
    `/api/v1/admin/users?page=${page}&limit=10`,
    fetcher
  );

  const handleDelete = async (userId: string) => {
    try {
      await usersAPI.delete(userId);
      toast.success('User deleted successfully');
      await mutate();
      setDeleteModal({ open: false });
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleUpdateStatus = async (
    userId: string,
    action: 'approve' | 'reject' | 'suspend'
  ) => {
    try {
      setIsUpdatingStatus(true);

      // IMPORTANT: Make sure you have this helper in usersAPI:
      // updateStatus: (userId, action) => api.patch(`/api/v1/admin/users/${userId}/status`, { action })
      await usersAPI.updateStatus(userId, action);

      toast.success('User status updated');
      await mutate();
      setStatusModal({ open: false });
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const UserTableSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-24" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User list</h1>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Added date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-6">
                      <UserTableSkeleton />
                    </td>
                  </tr>
                ) : users && Array.isArray(users) ? (
                  users.map((user: any) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.profileImage?.url || '/avatar-placeholder.png'}
                            alt={user.name || 'User'}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <span className="font-medium">{user.name || 'Unnamed'}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {user.email || '-'}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                      </td>

                       <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            setStatusModal({
                              open: true,
                              userId: user._id,
                              current: user.accountStatus || 'pending',
                              name: user.name || 'User',
                            })
                          }
                          className="group flex items-center gap-2 px-2 py-1 rounded-md transition-all hover:bg-slate-50 active:scale-95 cursor-pointer"
                          title="Change Status"
                        >
                          {/* Status Badge */}
                          <StatusBadge status={user.accountStatus || 'pending'}  />

                          {/* Click Icon - Only visible/colored on hover to keep UI clean */}
                          <MousePointerClick className="w-4 h-4 text-slate-400 transition-colors group-hover:text-[#308FAD]" />
                        </button>
                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => setDeleteModal({ open: true, userId: user._id })}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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

        <Button variant="outline" size="sm" onClick={() => setPage(page + 1)}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.open}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={() => deleteModal.userId && handleDelete(deleteModal.userId)}
        onCancel={() => setDeleteModal({ open: false })}
      />

      {/* Status Modal */}
      {statusModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-8 h-8 text-slate-700" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">
              Update Status
            </h3>

            <p className="text-slate-500 mb-6 text-center">
              {statusModal.name} is currently{' '}
              <span className="font-semibold">{statusModal.current}</span>
            </p>

            <div className="flex flex-col gap-3">
              <Button
                disabled={isUpdatingStatus}
                onClick={() =>
                  statusModal.userId && handleUpdateStatus(statusModal.userId, 'approve')
                }
              >
                {isUpdatingStatus ? 'Updating...' : 'Approve'}
              </Button>

              <Button
                variant="ghost"
                disabled={isUpdatingStatus}
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
