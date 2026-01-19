'use client';

import React from "react"

import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Edit3 } from 'lucide-react';

interface StatusUpdateModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  currentStatus: string;
  availableStatuses: Array<{
    value: string;
    label: string;
    color: string;
    icon: React.ReactNode;
  }>;
  onStatusChange: (status: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function StatusUpdateModal({
  isOpen,
  title,
  description,
  currentStatus,
  availableStatuses,
  onStatusChange,
  onConfirm,
  onCancel,
  isLoading = false,
}: StatusUpdateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6 space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>

        {/* Status Options */}
        <div className="space-y-2">
          {availableStatuses.map((status) => (
            <label
              key={status.value}
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                currentStatus === status.value
                  ? `border-2 ${status.color}`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="status"
                value={status.value}
                checked={currentStatus === status.value}
                onChange={(e) => onStatusChange(e.target.value)}
                className="w-4 h-4"
              />
              <div className="flex items-center gap-2 flex-1">
                {status.icon}
                <span className="font-medium text-sm capitalize">{status.label}</span>
              </div>
            </label>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 bg-transparent"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Status'}
          </Button>
        </div>
      </div>
    </div>
  );
}
