# TanStack Query (React Query) Integration Guide

## Overview

This project uses **TanStack Query v5** (formerly React Query) for server state management. It provides powerful features like caching, background refetching, synchronization, and deduplication of requests.

## Setup

### 1. Providers Component (`/app/providers.tsx`)

```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { useState } from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 10, // 10 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  )
}
```

### 2. Root Layout Integration (`/app/layout.tsx`)

The root layout wraps all children with the Providers component:

```typescript
import Providers from './providers'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
```

## Custom Hooks

### Authentication Hooks (`/hooks/useAuth.ts`)

#### `useLogin()`

Handles user login with automatic token storage and redirect.

```typescript
const { mutate: login, isPending, error } = useLogin();

login(
  { email, password },
  {
    onSuccess: () => {
      toast.success('Login successful!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message);
    },
  }
);
```

#### `useForgotPassword()`

Initiates password reset flow by sending OTP to email.

```typescript
const { mutate: forgotPassword, isPending } = useForgotPassword();

forgotPassword(email, {
  onSuccess: () => {
    toast.success('OTP sent to your email');
  },
});
```

#### `useVerifyResetCode()`

Verifies OTP code before password reset.

```typescript
const { mutate: verifyOtp, isPending } = useVerifyResetCode();

verifyOtp(
  { email, resetCode },
  {
    onSuccess: () => {
      router.push('/auth/reset-password');
    },
  }
);
```

#### `useResetPassword()`

Resets password with verified reset code.

```typescript
const { mutate: resetPassword, isPending } = useResetPassword();

resetPassword(
  {
    email,
    resetCode,
    newPassword,
    newPasswordConfirm: confirmPassword,
  },
  {
    onSuccess: () => {
      router.push('/auth/login');
    },
  }
);
```

#### `useChangePassword()`

Changes password for authenticated users.

```typescript
const { mutate: changePassword, isPending, error } = useChangePassword();

changePassword(
  { oldPassword, newPassword },
  {
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
  }
);
```

#### `useProfile()`

Fetches current user profile (queries are cached).

```typescript
const { data: profile, isLoading, error } = useProfile();
```

#### `useUpdateProfile()`

Updates user profile information.

```typescript
const { mutate: updateProfile, isPending } = useUpdateProfile();

updateProfile(profileData, {
  onSuccess: () => {
    toast.success('Profile updated');
  },
});
```

#### `useLogout()`

Returns a function to clear tokens and redirect to login.

```typescript
const logout = useLogout();

logout(); // Clears everything and redirects
```

### Admin Data Hooks (`/hooks/useAdmin.ts`)

#### User Management

```typescript
// Get paginated list of users
const { data, isLoading, error } = useGetUsers(page, limit);

// Get single user by ID
const { data: user } = useGetUserById(userId);

// Update user status
const { mutate: updateStatus, isPending } = useUpdateUserStatus();

// Delete user
const { mutate: deleteUser, isPending } = useDeleteUser();
```

#### Category Management

```typescript
// Get paginated list of categories
const { data, isLoading } = useGetCategories(page, limit);

// Get approved categories only
const { data: approved } = useGetApprovedCategories(page, limit);

// Get single category
const { data: category } = useGetCategoryById(categoryId);

// Update category status (pending/approved/rejected)
const { mutate: updateStatus, isPending } = useUpdateCategoryStatus();

// Delete category
const { mutate: deleteCategory, isPending } = useDeleteCategory();
```

#### Job Management

```typescript
// Get paginated list of jobs
const { data, isLoading } = useGetJobs(page, limit);

// Get single job details
const { data: job } = useGetJobById(jobId);
```

#### Applications Management

```typescript
// Get paginated list of applications
const { data, isLoading } = useGetApplications(page, limit);

// Get single application details
const { data: application } = useGetApplicationById(applicationId);
```

#### Reviews Management

```typescript
// Get paginated list of reviews
const { data, isLoading } = useGetReviews(page, limit);

// Get single review
const { data: review } = useGetReviewById(reviewId);

// Update review status (approve/reject/edit)
const { mutate: updateStatus, isPending } = useUpdateReviewStatus();
```

## Usage Examples

### Login Page

```typescript
'use client';

import { useLogin } from '@/hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, isPending, error } = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    login({ email, password }, {
      onSuccess: () => {
        toast.success('Login successful!');
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message);
      },
    });
  };

  return (
    <form onSubmit={handleLogin}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input value={password} onChange={(e) => setPassword(e.target.value)} />
      <button disabled={isPending}>
        {isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### User List with Pagination

```typescript
'use client';

import { useGetUsers } from '@/hooks/useAdmin';
import { useState } from 'react';

export default function UserListPage() {
  const [page, setPage] = useState(1);
  const { data: users, isLoading, error } = useGetUsers(page, 10);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <table>
        <tbody>
          {users?.data?.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
}
```

### Update User Status

```typescript
'use client';

import { useUpdateUserStatus } from '@/hooks/useAdmin';
import { toast } from 'sonner';

export function UserStatusButton({ userId, currentStatus }) {
  const { mutate: updateStatus, isPending } = useUpdateUserStatus();

  const handleStatusChange = () => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    updateStatus(
      { userId, status: newStatus },
      {
        onSuccess: () => {
          toast.success(`User status updated to ${newStatus}`);
        },
        onError: () => {
          toast.error('Failed to update status');
        },
      }
    );
  };

  return (
    <button onClick={handleStatusChange} disabled={isPending}>
      {isPending ? 'Updating...' : `Change to ${newStatus}`}
    </button>
  );
}
```

## Key Concepts

### Queries vs Mutations

- **Queries**: Fetch data (read operations). Cached automatically.
- **Mutations**: Modify data (create/update/delete operations). Trigger refetches on success.

### Cache Invalidation

TanStack Query automatically invalidates related queries when mutations succeed:

```typescript
// When updateStatus mutation succeeds, both queries are invalidated
queryClient.invalidateQueries({ queryKey: ['users'] });
queryClient.invalidateQueries({ queryKey: ['approvedCategories'] });
```

### Loading States

Use `isPending` from queries and mutations:

```typescript
const { isPending, isLoading } = useGetUsers();
// isPending: True while request is in flight
// isLoading: True if no cached data exists and request in flight
```

## Configuration

### Default Options (in `/app/providers.tsx`)

```typescript
{
  queries: {
    staleTime: 1000 * 60 * 5,      // Data is fresh for 5 minutes
    gcTime: 1000 * 60 * 10,        // Cached data kept for 10 minutes
    retry: 1,                        // Retry failed requests once
    refetchOnWindowFocus: false,     // Don't refetch when window regains focus
  },
  mutations: {
    retry: 1,                        // Retry failed mutations once
  },
}
```

### Per-Query Configuration

Override defaults for specific queries:

```typescript
useQuery({
  queryKey: ['critical-data'],
  queryFn: fetchCriticalData,
  staleTime: 0,                      // Never consider stale
  gcTime: 1000 * 60 * 60,           // Keep for 1 hour
})
```

## Best Practices

1. **Use descriptive query keys**: `['users', page, limit]` not just `['data']`
2. **Leverage automatic caching**: Don't fetch the same data twice
3. **Handle errors gracefully**: Always provide `onError` handlers
4. **Show loading states**: Use `isPending` and `isLoading`
5. **Invalidate strategically**: Only invalidate related queries on mutations
6. **Use DevTools in development**: `@tanstack/react-query-devtools` for debugging

## Common Patterns

### Refetch on Demand

```typescript
const { refetch } = useGetUsers();

const handleManualRefresh = () => {
  refetch();
};
```

### Dependent Queries

```typescript
// Only fetch job details when jobId is available
const { data: job } = useGetJobById(jobId, {
  enabled: !!jobId,
});
```

### Infinite Queries (Pagination)

For infinite scrolling, use `useInfiniteQuery`:

```typescript
const { data, fetchNextPage } = useInfiniteQuery({
  queryKey: ['jobs'],
  queryFn: ({ pageParam = 1 }) => getJobs(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});
```

## Troubleshooting

### Queries Not Updating After Mutation

Ensure mutation is invalidating the correct query key:

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({
    queryKey: ['users'], // Must match useGetUsers queryKey
  });
}
```

### Request Duplicates

This is normal! TanStack Query deduplicates simultaneous requests automatically.

### DevTools Not Working

Install and wrap your app with DevTools:

```bash
npm install @tanstack/react-query-devtools
```

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

<QueryClientProvider client={queryClient}>
  {children}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

## Migration Guide

If moving from SWR or other solutions, refer to [TanStack Query migration guide](https://tanstack.com/query/latest/docs/react/guides/migrating-from-react-query-4).
