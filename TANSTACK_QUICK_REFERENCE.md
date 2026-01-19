# TanStack Query Quick Reference Card

## Setup (Already Done ✅)

```typescript
// Providers set up in /app/providers.tsx
// Root layout already wraps app with Providers
// All hooks ready to use
```

## Common Patterns

### Query (Fetch Data)

```typescript
// Basic query
const { data, isLoading, error } = useGetUsers(1, 10);

// Query with dependency
const { data } = useGetUserById(userId, {
  enabled: !!userId,
});

// Refetch manually
const { refetch } = useGetUsers();
refetch();

// Infinite scroll
const { data, fetchNextPage } = useInfiniteQuery({
  queryKey: ['jobs'],
  queryFn: ({ pageParam = 1 }) => getJobs(pageParam),
  getNextPageParam: (last) => last.nextCursor,
});
```

### Mutation (Modify Data)

```typescript
// Update data
const { mutate, isPending, error } = useUpdateUserStatus();

mutate(
  { userId, status: 'active' },
  {
    onSuccess: () => toast.success('Updated'),
    onError: (err) => toast.error(err.response?.data?.message),
    onMutate: async (variables) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previous = queryClient.getQueryData(['users']);
      // Update cache
      return { previous };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  }
);
```

## Hook Cheat Sheet

### Auth Hooks

```typescript
// Login
const { mutate: login, isPending } = useLogin();
login({ email, password }, { onSuccess: () => {...} });

// Forgot Password
const { mutate: forgotPassword, isPending } = useForgotPassword();
forgotPassword(email, { onSuccess: () => {...} });

// Verify OTP
const { mutate: verifyOtp, isPending } = useVerifyResetCode();
verifyOtp({ email, resetCode }, { onSuccess: () => {...} });

// Reset Password
const { mutate: resetPassword, isPending } = useResetPassword();
resetPassword({ email, resetCode, newPassword, newPasswordConfirm }, {...});

// Change Password
const { mutate: changePassword, isPending } = useChangePassword();
changePassword({ oldPassword, newPassword }, {...});

// Get Profile
const { data: profile, isLoading } = useProfile();

// Update Profile
const { mutate: updateProfile, isPending } = useUpdateProfile();

// Logout
const logout = useLogout();
logout();
```

### User Management

```typescript
// Get Users
const { data: users, isLoading } = useGetUsers(page, limit);

// Get User
const { data: user } = useGetUserById(userId);

// Update Status
const { mutate: updateStatus } = useUpdateUserStatus();

// Delete User
const { mutate: deleteUser } = useDeleteUser();
```

### Category Management

```typescript
// Get Categories
const { data: categories } = useGetCategories(page, limit);

// Get Approved
const { data: approved } = useGetApprovedCategories(page, limit);

// Get Category
const { data: category } = useGetCategoryById(categoryId);

// Update Status
const { mutate: updateStatus } = useUpdateCategoryStatus();

// Delete Category
const { mutate: deleteCategory } = useDeleteCategory();
```

### Job Management

```typescript
// Get Jobs
const { data: jobs } = useGetJobs(page, limit);

// Get Job
const { data: job } = useGetJobById(jobId);
```

### Application Management

```typescript
// Get Applications
const { data: apps } = useGetApplications(page, limit);

// Get Application
const { data: app } = useGetApplicationById(applicationId);
```

### Review Management

```typescript
// Get Reviews
const { data: reviews } = useGetReviews(page, limit);

// Get Review
const { data: review } = useGetReviewById(reviewId);

// Update Status
const { mutate: updateStatus } = useUpdateReviewStatus();
```

## State Variables

### Query States

```typescript
const {
  data,              // Result from server
  isLoading,        // No cache + loading
  isPending,        // Request in flight
  isError,          // Has error
  isSuccess,        // Successful
  error,            // Error object
  refetch,          // Manual refetch function
} = useGetUsers();
```

### Mutation States

```typescript
const {
  mutate,           // Function to trigger mutation
  isPending,        // Mutation in flight
  isError,          // Has error
  isSuccess,        // Success
  error,            // Error object
  data,             // Response data
  reset,            // Reset mutation state
} = useUpdateUserStatus();
```

## Disable States Pattern

```typescript
// Use isPending to disable inputs during requests
<input disabled={isPending} />
<button disabled={isPending}>
  {isPending ? 'Loading...' : 'Submit'}
</button>
```

## Error Handling Pattern

```typescript
const { error } = useSomeHook();
const displayError = error?.response?.data?.message || 'Something went wrong';

{displayError && (
  <div className="error">
    <AlertCircle />
    <p>{displayError}</p>
  </div>
)}
```

## Invalidation Pattern

```typescript
// After mutation, invalidate related queries
mutate(data, {
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ['users'],  // Parent key - invalidates all ['users', ...]
      exact: false,         // Optional: exact match only
    });
  }
});
```

## Cache Configuration

### Override Per-Query

```typescript
useQuery({
  queryKey: ['data'],
  queryFn: getData,
  staleTime: 0,              // Always fresh
  gcTime: 1000 * 60 * 60,   // 1 hour
  retry: 3,                  // Retry 3 times
  refetchInterval: 5000,     // Poll every 5 seconds
});
```

### Global Defaults (in providers.tsx)

```typescript
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  }
})
```

## Query Keys Convention

```typescript
// List queries
['users', page, limit]
['categories', page, limit]
['jobs', page, limit]

// Single resource
['user', userId]
['category', categoryId]
['job', jobId]

// Filtered/Special
['approvedCategories']
['profile']
['search', searchTerm]
```

## Debugging

### Check Cache

```typescript
// In browser console
window.__REACT_QUERY_CACHE__ // See all cached queries
```

### Install DevTools

```bash
npm install @tanstack/react-query-devtools
```

### Use in Layout

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

<QueryClientProvider client={queryClient}>
  {children}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

## Common Mistakes

### ❌ Don't: Direct API calls

```typescript
// OLD - Manual state management
const [data, setData] = useState(null);
useEffect(() => {
  api.getUsers().then(setData);
}, []);
```

### ✅ Do: Use hooks

```typescript
// NEW - Automatic caching & sync
const { data } = useGetUsers();
```

### ❌ Don't: Wrong query key

```typescript
// Won't invalidate
queryClient.invalidateQueries({ queryKey: ['user'] });
// When hook uses queryKey: ['users', 1, 10]
```

### ✅ Do: Use parent key

```typescript
// Will invalidate all users queries
queryClient.invalidateQueries({ queryKey: ['users'] });
```

### ❌ Don't: Manual refetch

```typescript
// Unnecessary
const { data, refetch } = useGetUsers();
useEffect(() => {
  refetch();
}, [deps]);
```

### ✅ Do: Let TanStack Query manage

```typescript
// Automatic invalidation on mutation
mutate(data, {
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  }
});
```

## Performance Tips

1. **Use specific query keys**: `['users', 1, 10]` not `['data']`
2. **Set appropriate staleTime**: Don't fetch every second
3. **Disable refetchOnWindowFocus**: Unless needed
4. **Use exact: true**: When exact match required
5. **Implement pagination**: Not infinite scroll for large lists
6. **Avoid unnecessary re-renders**: Use proper dependency arrays
7. **Batch mutations**: Group related updates
8. **Use background refetching**: Don't block UI

## API Integration

### Token Management

```typescript
import { setAuthToken } from '@/lib/api';

// After login
setAuthToken(token);
// Token automatically added to all requests

// Interceptor handles 401
// Automatically redirects to login
```

## Files to Reference

- **Setup**: `/app/providers.tsx`
- **Auth Hooks**: `/hooks/useAuth.ts`
- **Admin Hooks**: `/hooks/useAdmin.ts`
- **API Client**: `/lib/api.ts`
- **Full Guide**: `/TANSTACK_QUERY_GUIDE.md`
- **Implementation**: `/TANSTACK_QUERY_IMPLEMENTATION.md`

## Support

For issues or questions:
1. Check `/TANSTACK_QUERY_GUIDE.md` for detailed examples
2. Check `/TANSTACK_QUERY_IMPLEMENTATION.md` for architecture
3. Visit [TanStack Query Docs](https://tanstack.com/query/latest)
4. Enable DevTools for debugging
