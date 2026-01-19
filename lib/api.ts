import axios, { AxiosError, AxiosInstance } from 'axios';
import { getSession, signOut } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:5006';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    if (typeof window === 'undefined') return config;

    const session = await getSession();
    const token = (session as any)?.accessToken as string | undefined;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      await signOut({ callbackUrl: '/auth/login', redirect: true });
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (_token: string) => {};

export const clearAuthToken = () => {};

export default api;

// USERS API
export const usersAPI = {
  getAll: (page = 1, limit = 10) => 
    api.get(`/api/v1/admin/users?page=${page}&limit=${limit}`),
  
  getSingle: (userId: string) => 
    api.get(`/api/v1/admin/users/${userId}`),
  
  updateStatus: (userId: string, action: string) => 
    api.patch(`/api/v1/admin/users/${userId}/status`, { action }),
  
  delete: (userId: string) => 
    api.delete(`/api/v1/admin/users/${userId}`),
};

export const categoriesAPI = {
  getAll: (page = 1, limit = 10) =>
    api.get(`/api/v1/admin/categories?page=${page}&limit=${limit}`),

  updateStatus: (
    categoryId: string,
    status: "pending" | "approved" | "rejected"
  ) =>
    api.patch(`/api/v1/admin/categories/${categoryId}`, { status }),

  delete: (categoryId: string) =>
    api.delete(`/api/v1/admin/categories/${categoryId}`),
};


// JOBS API
export const jobsAPI = {
  getAll: (page = 1, limit = 10) => 
    api.get(`/api/v1/admin/jobs?page=${page}&limit=${limit}`),
  
  getNearYou: (page = 1, limit = 10) => 
    api.get(`/api/v1/jobs/near-you?page=${page}&limit=${limit}`),
  
  getSingle: (jobId: string) => 
    api.get(`/api/v1/jobs/${jobId}`),
};

// APPLICATIONS API
export const applicationsAPI = {
  getAll: (page = 1, limit = 10) => 
    api.get(`/api/v1/admin/applications?page=${page}&limit=${limit}`),
  
  getSingle: (applicationId: string) => 
    api.get(`/api/v1/admin/applications/${applicationId}`),
};

// REVIEWS API
export const reviewsAPI = {
  getAll: (page = 1, limit = 10) => 
    api.get(`/api/v1/admin/reviews?page=${page}&limit=${limit}`),
  
  getSingle: (reviewId: string) => 
    api.get(`/api/v1/admin/reviews/${reviewId}`),
  
  updateStatus: (reviewId: string, action: 'approve' | 'reject' | 'edit', editedText?: string, adminNote?: string) => 
    api.patch(`/api/v1/admin/reviews/${reviewId}`, { action, editedText, adminNote }),
};

// AUTHENTICATION API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post(`/api/v1/auth/login`, { email, password }),
  
  forgotPassword: (email: string) =>
    api.post(`/api/v1/auth/forget`, { email }),
  
  verifyResetOtp: (email: string, otp: string) =>
    api.post(`/api/v1/auth/verify-otp`, { email, otp }),
  
  resetPassword: (email: string, otp: string, password: string) =>
    api.post(`/api/v1/auth/reset-password`, { email, otp, password }),
  
  changePassword: (oldPassword: string, newPassword: string) =>
    api.post(`/api/v1/auth/change-password`, { oldPassword, newPassword }),
  
  refreshToken: (refreshToken: string) =>
    api.post(`/api/v1/auth/refresh-token`, { refreshToken }),

  logout: () => api.post(`/api/v1/auth/logout`),
};

// PROFILE API
export const profileAPI = {
  getProfile: () => 
    api.get(`/api/v1/users`),
  
  updateProfile: (data: any) => 
    api.put(`/api/v1/users/update-profile`, data),
};
