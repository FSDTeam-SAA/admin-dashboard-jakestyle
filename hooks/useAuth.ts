'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authAPI, profileAPI } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { signIn, signOut, useSession } from 'next-auth/react'

export function useLogin() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const result = await signIn('credentials', {
        ...credentials,
        redirect: false,
      })

      if (!result || result?.error) {
        throw new Error(result?.error || 'Unable to login')
      }

      return result
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
      router.push('/admin')
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authAPI.forgotPassword(email),
  })
}

export function useVerifyResetCode() { // kept name for UI compatibility
  return useMutation({
    mutationFn: ({ email, resetCode }: { email: string; resetCode: string }) =>
      authAPI.verifyResetOtp(email, resetCode),
  })
}

export function useResetPassword() {
  const router = useRouter()

  return useMutation({
    mutationFn: (data: {
      email: string
      resetCode: string
      newPassword: string
      newPasswordConfirm: string
    }) => authAPI.resetPassword(data.email, data.resetCode, data.newPassword),
    onSuccess: () => {
      router.push('/auth/login')
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
      authAPI.changePassword(oldPassword, newPassword),
  })
}

export function useProfile() {
  const { data: session } = useSession()

  return useQuery({
    queryKey: ['profile'],
    queryFn: () => profileAPI.getProfile(),
    enabled: !!session?.accessToken,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: any) => profileAPI.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return async () => {
    queryClient.clear()
    try {
      await authAPI.logout()
    } catch (err) {
      // ignore logout failures to avoid blocking user
    }
    await signOut({ callbackUrl: '/auth/login' })
    router.push('/auth/login')
  }
}
