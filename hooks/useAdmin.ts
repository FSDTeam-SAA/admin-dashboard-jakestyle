'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  usersAPI,
  categoriesAPI,
  jobsAPI,
  applicationsAPI,
  reviewsAPI,
} from '@/lib/api'

// USERS HOOKS
export function useGetUsers(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['users', page, limit],
    queryFn: () => usersAPI.getAll(page, limit),
  })
}

export function useGetUserById(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => usersAPI.getSingle(userId),
    enabled: !!userId,
  })
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: 'active' | 'inactive' }) =>
      usersAPI.updateStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => usersAPI.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

// CATEGORIES HOOKS
export function useGetCategories(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['categories', page, limit],
    queryFn: () => categoriesAPI.getAll(page, limit),
  })
}

export function useGetCategoryById(categoryId: string) {
  return useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => categoriesAPI.getSingle(categoryId),
    enabled: !!categoryId,
  })
}

export function useGetApprovedCategories(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['approvedCategories', page, limit],
    queryFn: () => categoriesAPI.getApproved(page, limit),
  })
}

export function useUpdateCategoryStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ categoryId, status }: { categoryId: string; status: 'pending' | 'approved' | 'rejected' }) =>
      categoriesAPI.updateStatus(categoryId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['approvedCategories'] })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (categoryId: string) => categoriesAPI.deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

// JOBS HOOKS
export function useGetJobs(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['jobs', page, limit],
    queryFn: () => jobsAPI.getAll(page, limit),
  })
}

export function useGetJobById(jobId: string) {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobsAPI.getSingle(jobId),
    enabled: !!jobId,
  })
}

// APPLICATIONS HOOKS
export function useGetApplications(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['applications', page, limit],
    queryFn: () => applicationsAPI.getAll(page, limit),
  })
}

export function useGetApplicationById(applicationId: string) {
  return useQuery({
    queryKey: ['application', applicationId],
    queryFn: () => applicationsAPI.getSingle(applicationId),
    enabled: !!applicationId,
  })
}

// REVIEWS HOOKS
export function useGetReviews(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['reviews', page, limit],
    queryFn: () => reviewsAPI.getAll(page, limit),
  })
}

export function useGetReviewById(reviewId: string) {
  return useQuery({
    queryKey: ['review', reviewId],
    queryFn: () => reviewsAPI.getSingle(reviewId),
    enabled: !!reviewId,
  })
}

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      reviewId,
      action,
      editedText,
      adminNote,
    }: {
      reviewId: string
      action: 'approve' | 'reject' | 'edit'
      editedText?: string
      adminNote?: string
    }) => reviewsAPI.updateStatus(reviewId, action, editedText, adminNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
  })
}
