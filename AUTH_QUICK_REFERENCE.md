# Authentication Quick Reference

## Routes & Pages

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | Redirect Logic | Redirects to `/admin` or `/auth/login` |
| `/auth/login` | Login Form | Email & password login |
| `/auth/forgot-password` | Email Form | Request OTP for password reset |
| `/auth/verify-otp` | OTP Input | Enter 6-digit OTP code |
| `/auth/reset-password` | Password Form | Set new password |
| `/admin/settings` | Settings Tabs | Personal info & change password |

## API Functions

### Authentication
```typescript
import { authAPI } from '@/lib/api';

// Login
authAPI.login(email, password)

// Password Reset Flow
authAPI.forgotPassword(email)
authAPI.verifyResetCode(email, resetCode)
authAPI.resetPassword(email, resetCode, newPassword, newPasswordConfirm)

// Account
authAPI.changePassword(oldPassword, newPassword)
authAPI.refreshToken()
```

### Profile
```typescript
import { profileAPI } from '@/lib/api';

profileAPI.getProfile()
profileAPI.updateProfile(data)
```

## Token Management

```typescript
import { setAuthToken, clearAuthToken } from '@/lib/api';

// Store token
setAuthToken(token);

// Clear token
clearAuthToken();

// Check token
const token = localStorage.getItem('accessToken');
```

## Using Toast Notifications

```typescript
import { toast } from 'sonner';

toast.success('Success message');
toast.error('Error message');
toast.loading('Loading message');
toast.info('Info message');
```

## Form Validation Examples

### Email Validation
```typescript
const handleSubmit = (email: string) => {
  if (!email || !email.includes('@')) {
    setError('Please enter valid email');
    return;
  }
}
```

### Password Validation
```typescript
if (password.length < 6) {
  setError('Password must be at least 6 characters');
}

if (newPassword !== confirmPassword) {
  setError('Passwords do not match');
}
```

### OTP Validation
```typescript
if (otp.join('').length !== 6) {
  setError('Please enter all 6 digits');
}
```

## Common Patterns

### Loading State Pattern
```typescript
const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    // API call
    toast.success('Success!');
  } catch (err) {
    toast.error('Error occurred');
  } finally {
    setLoading(false);
  }
};
```

### Form Error Pattern
```typescript
const [error, setError] = useState('');

{error && (
  <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
    <AlertCircle className="w-5 h-5 text-red-600" />
    <p className="text-sm text-red-600">{error}</p>
  </div>
)}
```

### Loading Button Pattern
```typescript
<Button disabled={loading}>
  {loading ? (
    <>
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      Loading...
    </>
  ) : (
    'Submit'
  )}
</Button>
```

## Components Used

### UI Components (shadcn/ui)
- `Button` - All buttons
- `Input` - Text/email/password inputs
- `Card` - Card containers
- `CardHeader`, `CardContent`, `CardTitle`, `CardDescription`

### Icons (lucide-react)
- `Mail`, `Lock` - Input icons
- `Eye`, `EyeOff` - Password visibility
- `Loader2` - Loading spinner
- `AlertCircle` - Error icon
- `Check` - Success icon
- `ArrowLeft` - Back button

### Notifications
- `Toaster` from 'sonner' - Toast container
- `toast()` - Toast function

## State Management

### Simple Local State
```typescript
const [email, setEmail] = useState('');
const [loading, setLoading] = useState(false);
```

### Complex Form State
```typescript
const [otp, setOtp] = useState(['', '', '', '', '', '']);

const handleChange = (index: number, value: string) => {
  const newOtp = [...otp];
  newOtp[index] = value;
  setOtp(newOtp);
};
```

## Environment Variables

```env
# Required
NEXT_PUBLIC_API_URL=http://localhost:3000

# Optional (auto-configured)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

## Debugging Tips

### Check Token
```typescript
console.log('Token:', localStorage.getItem('accessToken'));
console.log('Admin User:', localStorage.getItem('adminUser'));
```

### Check API Response
```typescript
try {
  const response = await authAPI.login(email, password);
  console.log('Login Response:', response.data);
} catch (error) {
  console.error('Login Error:', error);
}
```

### Check Route Protection
The middleware/proxy file checks for token on admin routes:
```typescript
// In proxy.ts
if (pathname.startsWith('/admin') && !token) {
  return NextResponse.redirect(new URL('/auth/login', request.url));
}
```

## File Locations

```
Components:
- /components/ui/ - shadcn components
- /components/DeleteModal.tsx
- /components/StatusUpdateModal.tsx
- /components/ApproveRejectModal.tsx

Auth Pages:
- /app/auth/login/page.tsx
- /app/auth/forgot-password/page.tsx
- /app/auth/verify-otp/ (with Suspense wrapper)
- /app/auth/reset-password/ (with Suspense wrapper)
- /app/auth/layout.tsx

Admin Pages:
- /app/admin/settings/page.tsx
- /app/admin/users/page.tsx (existing)
- etc.

API & Utils:
- /lib/api.ts - API client
- /proxy.ts - Route protection
```

## Common Tasks

### Add New Protected Route
1. Create page in `/app/admin/[route]/page.tsx`
2. Use 'use client' directive
3. Import API functions
4. Implement loading & error states

### Add New API Endpoint
1. Add function to `/lib/api.ts`
2. Follow pattern: `api.method(endpoint, data)`
3. Use it in components

### Add Error Handling
```typescript
try {
  const response = await authAPI.login(email, password);
  // Handle success
} catch (err: any) {
  const message = err.response?.data?.message || 'Error occurred';
  setError(message);
  toast.error(message);
}
```

### Auto-Focus Next Field
```typescript
const inputRefs = useRef<HTMLInputElement[]>([]);

const handleChange = (index: number, value: string) => {
  if (value && index < 5) {
    inputRefs.current[index + 1]?.focus();
  }
};

<input ref={(el) => inputRefs.current[index] = el} />
```

## Performance Tips

1. Use `useCallback` for event handlers
2. Memoize form components with `memo`
3. Lazy load auth pages
4. Use SWR for data fetching
5. Implement request deduplication

## Security Checklist

- [x] Passwords sent to backend (not stored on client)
- [x] Tokens stored in localStorage (use httpOnly in production)
- [x] HTTPS in production
- [x] CORS configured
- [x] 401 error handling
- [x] Automatic logout on token expiry
- [x] Password visibility toggle
- [x] Input validation
- [ ] Rate limiting
- [ ] Account lockout
- [ ] 2FA/MFA
