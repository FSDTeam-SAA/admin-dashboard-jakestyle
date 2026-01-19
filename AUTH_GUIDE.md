# Authentication Guide

## Overview

This admin dashboard includes a complete authentication system with NextAuth integration, token management, and secure password handling.

## Authentication Flow

### 1. Login (`/auth/login`)
- Admin enters email and password
- Credentials are validated via `POST {{baseUrl}}/auth/login`
- API returns `accessToken`, `refreshToken`, and user data
- Token is stored in localStorage and axios interceptor
- User is redirected to `/admin` dashboard

**Request:**
```json
{
  "email": "admin@gmail.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User Logged in successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "role": "admin",
    "_id": "696cbfd208029c3d6878aa63",
    "user": {
      "name": "Admin Name",
      "email": "admin@gmail.com",
      "phone": "+447700900123",
      "address": "London, UK",
      "bio": "Admin bio",
      "profileImage": {}
    }
  }
}
```

### 2. Forgot Password (`/auth/forgot-password`)
- Admin enters email address
- API sends OTP to email via `POST {{baseUrl}}/auth/forgot-password`
- Admin is redirected to OTP verification page

**Request:**
```json
{
  "email": "admin@gmail.com"
}
```

### 3. OTP Verification (`/auth/verify-otp`)
- Admin enters 6-digit OTP received via email
- Auto-advances to next field on digit entry
- Can resend OTP (60-second cooldown)
- OTP is verified via `POST {{baseUrl}}/auth/verifyResetCode`
- Admin is redirected to password reset page

**Request:**
```json
{
  "email": "admin@gmail.com",
  "resetCode": "912822"
}
```

### 4. Reset Password (`/auth/reset-password`)
- Admin enters new password and confirmation
- Validation ensures passwords match (min 6 characters)
- Password reset via `POST {{baseUrl}}/auth/resetPassword`
- Admin is redirected to login page

**Request:**
```json
{
  "email": "admin@gmail.com",
  "resetCode": "912822",
  "newPassword": "NewPassword123!",
  "newPasswordConfirm": "NewPassword123!"
}
```

## Protected Routes

All admin routes (`/admin/*`) are protected by middleware. Unauthenticated requests are redirected to `/auth/login`.

### Route Protection:
- Token is checked via axios interceptor
- 401 responses trigger automatic logout and redirect
- Tokens are persisted in localStorage for session continuation

## Token Management

### Token Storage
- `accessToken` stored in localStorage
- Automatically injected into all API requests via axios interceptor
- Token removed on logout

### Token Refresh
```typescript
// Automatic refresh via POST {{baseUrl}}/auth/reset-refresh-token
const response = await authAPI.refreshToken();
```

## Account Management

### Change Password (`/admin/settings`)
- Located in Settings > Change Password tab
- Requires current password verification
- New password must be at least 6 characters
- Via `PATCH {{baseUrl}}/auth/change-password`

**Request:**
```json
{
  "oldPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

### Personal Information (`/admin/settings`)
- Located in Settings > Personal Information tab
- Edit profile information (name, email, phone, bio)
- Data persisted in localStorage (implement API call in production)

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User login |
| POST | `/auth/forgot-password` | Request password reset OTP |
| POST | `/auth/verifyResetCode` | Verify OTP code |
| POST | `/auth/resetPassword` | Reset password with code |
| PATCH | `/auth/change-password` | Change password for logged-in user |
| POST | `/auth/reset-refresh-token` | Refresh access token |

## Security Features

### Password Handling
- ✓ Passwords hashed on backend with bcrypt
- ✓ HTTPS required in production
- ✓ Minimum password length enforced
- ✓ Password visibility toggle in UI

### Token Security
- ✓ JWT tokens with expiration
- ✓ Refresh token rotation
- ✓ Secure httpOnly cookies recommended
- ✓ CORS configured for api requests

### Session Management
- ✓ Automatic logout on 401
- ✓ Token removal on logout
- ✓ Session persisted in localStorage
- ✓ Middleware route protection

## Axios Interceptor

Located in `/lib/api.ts`:

```typescript
// Request interceptor adds token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor handles 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## Error Handling

### Common Error Scenarios

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Invalid/expired token | Redirect to login |
| 404 Not Found | Invalid endpoint | Check API URL |
| 400 Bad Request | Invalid request data | Validate form inputs |
| 500 Server Error | Backend error | Check server logs |

### Toast Notifications
All errors display user-friendly toast messages via `sonner`:

```typescript
import { toast } from 'sonner';

toast.error('Login failed');
toast.success('Password updated');
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Demo Credentials

For development/testing:
- **Email:** admin@gmail.com
- **Password:** 123456

## Implementation Checklist

- [x] Login page with email/password
- [x] Forgot password flow with OTP
- [x] OTP verification with resend
- [x] Password reset form
- [x] Settings page with profile editing
- [x] Change password functionality
- [x] Axios interceptor for token management
- [x] Route protection middleware
- [x] Auto-logout on 401 errors
- [x] Error handling with toast notifications
- [x] Loading states and validation
- [x] Responsive design

## Next Steps

1. Connect to actual backend API
2. Configure production environment variables
3. Implement 2FA/MFA if required
4. Set up email service for OTP delivery
5. Configure HTTPS and secure cookies
6. Add account recovery options
7. Implement rate limiting on auth endpoints
