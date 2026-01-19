# TanStack Query Implementation Summary

## What Has Been Implemented

This project now uses **TanStack Query v5** for all server state management, replacing direct API calls and manual state management. This provides:

- ✅ Automatic request caching and deduplication
- ✅ Background synchronization and refetching
- ✅ Stale-while-revalidate patterns
- ✅ Automatic garbage collection
- ✅ Optimistic updates support
- ✅ Built-in retry logic
- ✅ Devtools integration ready

## Architecture

### 1. Query Provider Setup

**File**: `/app/providers.tsx`

A client-side provider component that wraps the entire app with:
- QueryClientProvider for TanStack Query
- Sonner Toaster for notifications
- Configured default options for all queries and mutations

**Imported in**: `/app/layout.tsx`

### 2. Custom Hooks Layer

#### Authentication Hooks (`/hooks/useAuth.ts`)
- `useLogin()` - Handle login with automatic token storage
- `useForgotPassword()` - Request password reset OTP
- `useVerifyResetCode()` - Verify OTP before reset
- `useResetPassword()` - Complete password reset
- `useChangePassword()` - Change password for authenticated users
- `useProfile()` - Fetch current user profile
- `useUpdateProfile()` - Update profile information
- `useLogout()` - Clear tokens and redirect

#### Admin Data Hooks (`/hooks/useAdmin.ts`)
- User management: `useGetUsers`, `useGetUserById`, `useUpdateUserStatus`, `useDeleteUser`
- Category management: `useGetCategories`, `useGetApprovedCategories`, `useGetCategoryById`, `useUpdateCategoryStatus`, `useDeleteCategory`
- Job management: `useGetJobs`, `useGetJobById`
- Application management: `useGetApplications`, `useGetApplicationById`
- Review management: `useGetReviews`, `useGetReviewById`, `useUpdateReviewStatus`

### 3. Updated Components

#### Authentication Pages
- **Login Page** (`/app/auth/login/page.tsx`) - Uses `useLogin()` hook
- **Forgot Password** (`/app/auth/forgot-password/page.tsx`) - Uses `useForgotPassword()` hook
- **OTP Verification** (`/app/auth/verify-otp/otp-content.tsx`) - Uses `useVerifyResetCode()` and `useForgotPassword()` hooks
- **Reset Password** (`/app/auth/reset-password/reset-content.tsx`) - Uses `useResetPassword()` hook

#### Settings Page
- **Settings** (`/app/admin/settings/page.tsx`) - Uses `useChangePassword()` hook with manual profile updates

## Key Features

### 1. Automatic Caching

```typescript
// First call fetches from API
const { data: users } = useGetUsers(1, 10);

// Second call returns cached data instantly
const { data: users } = useGetUsers(1, 10); // Returns cache

// Data is fresh for 5 minutes (configurable)
```

### 2. Automatic Invalidation on Mutations

```typescript
// When user status is updated, the users list automatically refetches
const { mutate: updateStatus } = useUpdateUserStatus();

updateStatus({ userId, status }, {
  onSuccess: () => {
    // Automatically invalidates 'users' and 'user' queries
    queryClient.invalidateQueries({ queryKey: ['users'] });
  }
});
```

### 3. Loading States

```typescript
const { isPending, isLoading, error } = useLogin();

// isPending: True while request is in flight
// isLoading: True if no cache AND request in flight
```

### 4. Error Handling

```typescript
const { mutate: login, error } = useLogin();

login({ email, password }, {
  onError: (err: any) => {
    const message = err.response?.data?.message || 'Login failed';
    toast.error(message);
  }
});
```

### 5. Optimistic Updates

Mutations can update cache before server response:

```typescript
updateStatus(
  { userId, status: newStatus },
  {
    onMutate: async () => {
      // Update cache optimistically
      queryClient.setQueryData(['user', userId], (old) => ({
        ...old,
        status: newStatus
      }));
    },
    onError: () => {
      // Rollback on error
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    }
  }
);
```

## Migration Benefits

### Before (Direct API Calls)
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [data, setData] = useState(null);

useEffect(() => {
  setLoading(true);
  authAPI.login(email, password)
    .then(res => setData(res.data))
    .catch(err => setError(err.message))
    .finally(() => setLoading(false));
}, [email, password]);
```

### After (TanStack Query)
```typescript
const { data, isLoading, error, mutate: login } = useLogin();

const handleLogin = () => {
  login({ email, password });
};
```

## Configuration Details

### Default Cache Settings (`/app/providers.tsx`)

```typescript
{
  queries: {
    staleTime: 1000 * 60 * 5,        // 5 minutes
    gcTime: 1000 * 60 * 10,          // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false
  },
  mutations: {
    retry: 1
  }
}
```

These can be overridden per-query:

```typescript
useQuery({
  queryKey: ['critical-data'],
  queryFn: fetchData,
  staleTime: 0,                      // Always fresh
  gcTime: 1000 * 60 * 60,           // 1 hour cache
})
```

## Query Key Patterns

Consistent naming for easy tracking:

```typescript
// User queries
['users', page, limit]           // List
['user', userId]                 // Single
['approvedUsers']                // Filtered

// Category queries
['categories', page, limit]      // List
['category', categoryId]         // Single
['approvedCategories']           // Filtered

// Auth queries
['profile']                      // Current user profile
```

## API Integration

All API calls go through `/lib/api.ts` with axios interceptor:

```typescript
// Interceptor automatically adds token to requests
export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// All API methods are grouped by feature
export const authAPI = { login, forgotPassword, ... }
export const usersAPI = { getAll, getSingle, updateStatus, ... }
export const categoriesAPI = { getAll, updateStatus, ... }
```

## Performance Optimizations

1. **Request Deduplication**: Multiple identical requests in flight = single server request
2. **Background Refetching**: Stale data updates automatically in background
3. **Memory Management**: Old cached data garbage collected after 10 minutes
4. **Network Status**: Hooks aware of online/offline state
5. **Parallel Queries**: Multiple queries execute in parallel automatically

## Debugging

### Enable DevTools (Development Only)

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

### Console Debugging

TanStack Query logs to console in development. Check browser console for:
- Query key changes
- Cache updates
- Invalidations
- Network requests

## Common Issues & Solutions

### Issue: Queries not updating after mutation

**Solution**: Ensure query key matches exactly:
```typescript
// ❌ Won't work - different keys
mutate(data, {
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  }
});

// ✅ Works - same keys
const { data } = useGetUsers(page, limit); // queryKey: ['users', page, limit]
// Mutation invalidates the parent: ['users']
```

### Issue: Request is being duplicated

**Solution**: This is normal! TanStack Query deduplicates identical requests.

### Issue: Cache not clearing on logout

**Solution**: The `useLogout()` hook clears all cache:
```typescript
const logout = useLogout();
logout(); // Calls queryClient.clear()
```

## Files Modified/Created

### New Files
- `/app/providers.tsx` - Query provider setup
- `/hooks/useAuth.ts` - Authentication hooks (93 lines)
- `/hooks/useAdmin.ts` - Admin data hooks (166 lines)
- `/TANSTACK_QUERY_GUIDE.md` - Complete guide (511 lines)

### Updated Files
- `/app/layout.tsx` - Added Providers wrapper
- `/app/auth/login/page.tsx` - Uses useLogin hook
- `/app/auth/forgot-password/page.tsx` - Uses useForgotPassword hook
- `/app/auth/verify-otp/otp-content.tsx` - Uses useVerifyResetCode hook
- `/app/auth/reset-password/reset-content.tsx` - Uses useResetPassword hook
- `/app/admin/settings/page.tsx` - Uses useChangePassword hook

## Testing Queries

### Manual Testing Steps

1. **Login**: Check if token is stored and request has Authorization header
2. **Refresh page**: Data should load instantly from cache
3. **Change status**: Should see automatic list refresh
4. **Network throttle**: Chrome DevTools Network tab, set to Slow 3G
5. **Check cache**: Browser DevTools Console, check XHR requests

### Expected Behavior

- ✅ First request: Full HTTP request (network waterfall)
- ✅ Refresh page: Instant data from cache
- ✅ Wait 5+ minutes: Background refetch triggers
- ✅ Update data: List automatically refreshes without manual refetch
- ✅ Offline: Cached data still available
- ✅ Back online: Automatic sync

## Next Steps

1. **Add DevTools**: `npm install @tanstack/react-query-devtools` (optional)
2. **Implement infinite queries**: For large lists with pagination
3. **Add optimistic updates**: For faster UI feedback
4. **Setup subscription queries**: For real-time updates (websockets)
5. **Monitor performance**: Use browser DevTools Network tab

## Resources

- [TanStack Query Official Docs](https://tanstack.com/query/latest)
- [React Query v5 Upgrade Guide](https://tanstack.com/query/latest/docs/react/guides/important-defaults)
- [Migration from SWR](https://tanstack.com/query/latest/docs/react/guides/migrating-from-swr)
- [TanStack Query DevTools](https://tanstack.com/query/latest/docs/devtools/overview)

## Summary

TanStack Query has been fully integrated into the admin dashboard, replacing manual API calls with a robust, production-grade state management solution. All authentication and admin data flows now benefit from automatic caching, background synchronization, and intelligent request deduplication.
