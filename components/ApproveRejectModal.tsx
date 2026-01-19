'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

interface ApproveRejectModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  actionType: 'approve' | 'reject' | null;
  onApprove: () => void;
  onReject: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  showReasonField?: boolean;
  reason?: string;
  onReasonChange?: (reason: string) => void;
}

export default function ApproveRejectModal({
  isOpen,
  title,
  description,
  actionType,
  onApprove,
  onReject,
  onCancel,
  isLoading = false,
  showReasonField = false,
  reason = '',
  onReasonChange,
}: ApproveRejectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6 space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>

        {/* Reason Field */}
        {showReasonField && actionType === 'reject' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Reason for Rejection</label>
            <textarea
              value={reason}
              onChange={(e) => onReasonChange?.(e.target.value)}
              rows={3}
              placeholder="Provide reason for rejection..."
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {actionType === null ? (
            <>
              <Button
                onClick={onCancel}
                variant="outline"
                className="flex-1 bg-transparent"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={onApprove}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                onClick={onReject}
                variant="destructive"
                className="flex-1"
                disabled={isLoading}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </>
          ) : actionType === 'approve' ? (
            <>
              <Button
                onClick={onCancel}
                variant="outline"
                className="flex-1 bg-transparent"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={onApprove}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Approving...' : 'Confirm Approve'}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={onCancel}
                variant="outline"
                className="flex-1 bg-transparent"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={onReject}
                variant="destructive"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? 'Rejecting...' : 'Confirm Reject'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
