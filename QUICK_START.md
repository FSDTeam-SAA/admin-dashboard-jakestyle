# Quick Start Guide

## Getting Started (5 minutes)

### 1. Set Environment Variable
```bash
# Create .env.local file in project root
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. Start Development Server
```bash
npm run dev
```
Visit: `http://localhost:3000`

### 3. Login
- **URL:** `http://localhost:3000/auth/login`
- **Email:** `admin@gmail.com`
- **Password:** `123456`

### 4. Access Dashboard
- **After Login:** `http://localhost:3000/admin`
- **Settings:** `http://localhost:3000/admin/settings`

---

## What's Available

### Authentication Pages
✅ `/auth/login` - Login form
✅ `/auth/forgot-password` - Request password reset
✅ `/auth/verify-otp` - Enter OTP code
✅ `/auth/reset-password` - Set new password
✅ `/admin/settings` - Profile & password management

### Admin Dashboard
✅ `/admin` - Overview with stats
✅ `/admin/users` - User management
✅ `/admin/categories` - Category management
✅ `/admin/jobs` - Job listings
✅ `/admin/applications` - Job applications
✅ `/admin/reviews` - Review moderation

---

## Core Features

### Authentication
```
1. Login with email/password
2. Forgot password → OTP verification → Reset password
3. Change password in settings
4. Edit profile information
5. Auto-logout on token expiry
```

### Protected Routes
```
All /admin/* routes require valid token
Unauthenticated users redirected to /auth/login
```

### API Integration
```
All endpoints in /lib/api.ts
Axios interceptor adds token automatically
Error handling with toast notifications
```

---

## File Locations

### Pages to Edit
```
/app/auth/login/page.tsx                 # Login
/app/auth/forgot-password/page.tsx       # Forgot password
/app/admin/settings/page.tsx             # Settings
/app/admin/page.tsx                      # Dashboard
```

### API Configuration
```
/lib/api.ts                              # All API endpoints
proxy.ts                                 # Route protection
```

### Components
```
/components/ui/                          # shadcn/ui components
/components/DeleteModal.tsx              # Modal examples
/components/StatusUpdateModal.tsx
/components/ApproveRejectModal.tsx
```

---

## Common Tasks

### Test Login
```bash
1. Go to http://localhost:3000
2. Automatically redirects to /auth/login
3. Enter: admin@gmail.com / 123456
4. Should redirect to /admin
```

### Test Password Reset
```bash
1. Click "Forgot Password?" on login page
2. Enter email: admin@gmail.com
3. Click "Send OTP"
4. Will redirect to OTP verification page
5. Enter any 6 digits
6. Then set new password
```

### Test Settings
```bash
1. Login to admin dashboard
2. Click Settings in sidebar
3. Click "Personal Information" tab
4. Click "Edit" button
5. Modify fields and click "Save Changes"
6. Click "Change Password" tab
7. Enter current and new password
```

### Check Token
```javascript
// In browser console
localStorage.getItem('accessToken')
JSON.parse(localStorage.getItem('adminUser'))
```

### Clear Session
```javascript
// In browser console
localStorage.clear()
window.location.href = '/auth/login'
```

---

## API Integration

### Connect to Your Backend
1. Update `NEXT_PUBLIC_API_URL` in `.env.local`
2. All API functions in `/lib/api.ts` will automatically use new URL
3. Token is automatically added to all requests

### Test API Endpoint
```bash
# Example: Test login endpoint
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"123456"}'
```

---

## Troubleshooting

### Issue: "Can't access /admin"
**Solution:**
- Check if you're logged in
- Check browser console for errors
- Verify `NEXT_PUBLIC_API_URL` is set correctly

### Issue: "Login fails"
**Solution:**
- Check API URL in .env.local
- Verify backend is running
- Check network tab in DevTools
- Look at API response in console

### Issue: "Token not persisting"
**Solution:**
- Check localStorage is not disabled
- Clear browser cache
- Check browser console for errors

### Issue: "Redirect loop"
**Solution:**
- Clear localStorage: `localStorage.clear()`
- Refresh page
- Check token validity

---

## Useful Commands

### Development
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Check code quality
```

### Database (if using)
```bash
npm run db:push          # Push schema to database
npm run db:studio        # Open database UI
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `/lib/api.ts` | API client, all endpoints |
| `/app/page.tsx` | Home redirect logic |
| `/proxy.ts` | Route protection |
| `/auth/login/page.tsx` | Login page |
| `/admin/settings/page.tsx` | Settings page |

---

## Architecture Overview

```
User Request
    ↓
Proxy.ts (Route Protection)
    ↓
Page Component
    ↓
API Call via /lib/api.ts
    ↓
Axios Interceptor (Add Token)
    ↓
Backend API
    ↓
Response
    ↓
Error Handling / Toast Notification
    ↓
Update UI / Redirect
```

---

## Next Steps

### For Development
1. ✅ Connect to backend API
2. ✅ Test all auth flows
3. ✅ Customize branding/colors
4. ✅ Add additional features

### For Production
1. ✅ Update environment variables
2. ✅ Enable HTTPS
3. ✅ Set secure cookies
4. ✅ Configure rate limiting
5. ✅ Deploy to Vercel/hosting

---

## Support

For detailed information, see:
- **AUTH_GUIDE.md** - Complete authentication guide
- **TESTING_GUIDE.md** - Test scenarios
- **AUTH_QUICK_REFERENCE.md** - Code snippets
- **VISUAL_GUIDE.md** - Design reference

---

## Demo Credentials

```
Email:    admin@gmail.com
Password: 123456
```

---

## Documentation Files

| Document | When to Use |
|----------|------------|
| QUICK_START.md | Getting started (this file) |
| AUTH_GUIDE.md | Understanding auth flow |
| AUTHENTICATION_IMPLEMENTATION.md | Implementation details |
| AUTH_QUICK_REFERENCE.md | Code snippets & examples |
| TESTING_GUIDE.md | Testing scenarios |
| VISUAL_GUIDE.md | Design & styling |
| COMPLETE_AUTH_SUMMARY.md | Full overview |

---

## What's Included

✅ Complete authentication system
✅ Login, forgot password, reset password
✅ Settings & profile management
✅ Token management & interceptors
✅ Route protection
✅ Error handling
✅ Toast notifications
✅ Responsive design
✅ Fully documented
✅ Production ready

---

## Getting Help

1. **Check the docs** - Most answers in documentation
2. **Check browser console** - Errors and API responses
3. **Check Network tab** - API requests and responses
4. **Check localStorage** - Token and user data

---

## Ready to Go!

You have everything needed to:
- ✅ Authenticate users
- ✅ Manage passwords securely
- ✅ Protect admin routes
- ✅ Manage user profiles
- ✅ Handle errors gracefully

**Start by testing login at:** `http://localhost:3000/auth/login`

---

## One More Thing

All authentication is pre-configured and ready to use. Simply:
1. Set your API URL
2. Run `npm run dev`
3. Test the login flow
4. Connect to your backend

That's it! 🚀
