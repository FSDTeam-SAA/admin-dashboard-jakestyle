# Testing Guide

## Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER AUTHENTICATION FLOW                  │
└─────────────────────────────────────────────────────────────┘

HOME PAGE (/)
    │
    ├─→ Logged In? → /admin/dashboard
    └─→ Not Logged In? → /auth/login


LOGIN FLOW
┌──────────────────────────┐
│   /auth/login            │
│ ┌──────────────────────┐ │
│ │ Email & Password     │ │
│ │ POST /auth/login     │ │
│ └──────────────────────┘ │
└──────────────┬───────────┘
               │
        ┌──────▼──────┐
        │ Valid Creds?│
        └──────┬──────┘
         Yes   │   No
             ┌─┴─┐
             │   └─→ Show Error → Retry
             │
        ┌────▼────────────┐
        │ Store Token &   │
        │ User Info       │
        │ Redirect /admin │
        └────┬────────────┘
             │
        ┌────▼──────────────┐
        │ AUTHENTICATED!    │
        │ (Can access all   │
        │  /admin/* routes) │
        └───────────────────┘


PASSWORD RESET FLOW
┌─────────────────────────────────┐
│  /auth/forgot-password          │
│ ┌─────────────────────────────┐ │
│ │ Email Input                 │ │
│ │ POST /auth/forgot-password  │ │
│ └─────────────────────────────┘ │
└──────────────┬──────────────────┘
               │
        ┌──────▼──────┐
        │ Send OTP    │
        │ to Email    │
        └──────┬──────┘
               │
        ┌──────▼──────────────────────┐
        │  /auth/verify-otp           │
        │ ┌──────────────────────────┐│
        │ │ 6-Digit OTP Input        ││
        │ │ Resend Option (60s timer)││
        │ │ POST /verifyResetCode    ││
        │ └──────────────────────────┘│
        └──────┬─────────────────────┘
               │
        ┌──────▼──────┐
        │ OTP Valid?  │
        └──────┬──────┘
         Yes   │   No
             ┌─┴─┐
             │   └─→ Show Error → Retry or Resend
             │
        ┌────▼───────────────────────┐
        │  /auth/reset-password       │
        │ ┌──────────────────────────┐│
        │ │ New Password              ││
        │ │ Confirm Password          ││
        │ │ POST /auth/resetPassword  ││
        │ └──────────────────────────┘│
        └────┬──────────────────────┘
             │
        ┌────▼─────────────────┐
        │ Passwords Match?     │
        │ Min 6 chars?         │
        └────┬─────────────────┘
         Yes │   No
           ┌─┴─┐
           │   └─→ Show Error → Retry
           │
        ┌──▼────────────────────┐
        │ Password Reset        │
        │ Redirect to Login     │
        └──────────────────────┘
```

## Test Scenarios

### Scenario 1: Successful Login
**Steps:**
1. Navigate to `/auth/login`
2. Enter email: `admin@gmail.com`
3. Enter password: `123456`
4. Click "Login"

**Expected Result:**
- ✓ Loading spinner shows
- ✓ Request sent to `/auth/login`
- ✓ Token stored in localStorage
- ✓ Redirected to `/admin`
- ✓ Toast: "Login successful!"

### Scenario 2: Failed Login
**Steps:**
1. Navigate to `/auth/login`
2. Enter email: `admin@gmail.com`
3. Enter password: `wrongpassword`
4. Click "Login"

**Expected Result:**
- ✓ Loading spinner shows
- ✓ API returns error
- ✓ Error message displays above form
- ✓ Toast: "Login failed. Please try again."
- ✓ User stays on login page

### Scenario 3: Empty Form Validation
**Steps:**
1. Navigate to `/auth/login`
2. Click "Login" without entering anything

**Expected Result:**
- ✓ Error message: "Please enter both email and password"
- ✓ No API request made
- ✓ Toast error shows

### Scenario 4: Forgot Password Email Entry
**Steps:**
1. Navigate to `/auth/forgot-password`
2. Enter email: `admin@gmail.com`
3. Click "Send OTP"

**Expected Result:**
- ✓ Loading spinner shows
- ✓ Success message displays
- ✓ Toast: "OTP sent to your email"
- ✓ After 2 seconds, redirects to `/auth/verify-otp`

### Scenario 5: OTP Entry with Auto-Advance
**Steps:**
1. On `/auth/verify-otp` page
2. Enter OTP digits one at a time

**Expected Result:**
- ✓ First digit entered, focus moves to next field
- ✓ All 6 digits auto-advance
- ✓ After 6th digit, can click Verify
- ✓ Backspace on empty field moves focus back

### Scenario 6: OTP Resend
**Steps:**
1. On `/auth/verify-otp` page
2. Wait or clear fields
3. Click "RESEND OTP" (if timer = 0)

**Expected Result:**
- ✓ New OTP sent to email
- ✓ Toast: "OTP resent to your email"
- ✓ Fields cleared
- ✓ 60-second timer starts
- ✓ Button disabled during timer

### Scenario 7: Password Reset
**Steps:**
1. On `/auth/reset-password` page
2. Enter new password: `NewPass123`
3. Enter confirmation: `NewPass123`
4. Click "Continue"

**Expected Result:**
- ✓ Loading spinner shows
- ✓ Password reset request sent
- ✓ Toast: "Password reset successfully"
- ✓ After 1.5 seconds, redirects to `/auth/login`

### Scenario 8: Password Mismatch
**Steps:**
1. On `/auth/reset-password` page
2. Enter new password: `NewPass123`
3. Enter confirmation: `DifferentPass123`
4. Click "Continue"

**Expected Result:**
- ✓ Error message: "Passwords do not match"
- ✓ No API request made
- ✓ Form fields remain populated

### Scenario 9: Short Password
**Steps:**
1. On `/auth/reset-password` page
2. Enter new password: `Pass`
3. Enter confirmation: `Pass`
4. Click "Continue"

**Expected Result:**
- ✓ Error message: "Password must be at least 6 characters"
- ✓ No API request made

### Scenario 10: Edit Personal Information
**Steps:**
1. Navigate to `/admin/settings`
2. Verify "Personal Information" tab active
3. Click "Edit" button
4. Modify fields (first name, last name, etc.)
5. Click "Save Changes"

**Expected Result:**
- ✓ Profile avatar shows initials
- ✓ Form fields become editable
- ✓ Save/Cancel buttons appear
- ✓ Loading spinner shows
- ✓ Toast: "Profile updated successfully"
- ✓ Data saved in localStorage
- ✓ Form closes after save

### Scenario 11: Change Password
**Steps:**
1. Navigate to `/admin/settings`
2. Click "Change Password" tab
3. Enter current password: `123456`
4. Enter new password: `NewPass789`
5. Confirm password: `NewPass789`
6. Click "Update Password"

**Expected Result:**
- ✓ All password fields have visibility toggles
- ✓ Loading spinner shows
- ✓ PATCH request sent to `/auth/change-password`
- ✓ Toast: "Password changed successfully"
- ✓ Fields cleared after success

### Scenario 12: Password Visibility Toggle
**Steps:**
1. On any password field page
2. Click eye icon next to password field

**Expected Result:**
- ✓ Field type changes from "password" to "text"
- ✓ Password becomes visible
- ✓ Eye icon changes to eye-off icon
- ✓ Click again to hide password

### Scenario 13: Route Protection
**Steps:**
1. Clear localStorage (simulate logout)
2. Navigate directly to `/admin`

**Expected Result:**
- ✓ Redirected to `/auth/login`
- ✓ Cannot access admin routes without token

### Scenario 14: Auto-Logout on 401
**Steps:**
1. Logged in and accessing `/admin`
2. Simulate 401 error (modify token or API returns 401)
3. Make any API request

**Expected Result:**
- ✓ Axios interceptor catches 401
- ✓ Token removed from localStorage
- ✓ Redirected to `/auth/login`
- ✓ Cannot access admin anymore

### Scenario 15: Forgot Password Link from Login
**Steps:**
1. On `/auth/login` page
2. Click "Forgot Password?" link

**Expected Result:**
- ✓ Navigates to `/auth/forgot-password`
- ✓ Back link works from all auth pages

## API Testing

### Test Login Endpoint
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gmail.com",
    "password": "123456"
  }'
```

### Test Forgot Password
```bash
curl -X POST http://localhost:3000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@gmail.com"}'
```

### Test Reset Password
```bash
curl -X POST http://localhost:3000/auth/resetPassword \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gmail.com",
    "resetCode": "912822",
    "newPassword": "NewPass123",
    "newPasswordConfirm": "NewPass123"
  }'
```

### Test Change Password
```bash
curl -X PATCH http://localhost:3000/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "oldPassword": "123456",
    "newPassword": "NewPass123"
  }'
```

## Browser DevTools Testing

### Check Stored Data
```javascript
// In Chrome DevTools Console
localStorage.getItem('accessToken');
JSON.parse(localStorage.getItem('adminUser'));
```

### Clear All Auth Data
```javascript
localStorage.removeItem('accessToken');
localStorage.removeItem('adminUser');
localStorage.removeItem('resetEmail');
localStorage.removeItem('resetCode');
```

### Monitor Network Requests
1. Open DevTools → Network tab
2. Perform auth actions
3. Check request headers (Authorization)
4. Check response status codes

### Check Axios Interceptor
```javascript
// Should show token in all requests
// Look for Authorization: Bearer ... header
```

## Performance Testing

### Test Loading States
1. Login page should show loading spinner
2. Settings page should show skeleton loader
3. All buttons disabled during submission

### Test Error Recovery
1. Trigger network error (offline mode)
2. Should show error message
3. Can retry action

## Cross-Browser Testing

Test on:
- Chrome/Edge ✓
- Firefox ✓
- Safari ✓
- Mobile browsers ✓

## Responsive Design Testing

### Mobile (375px width)
- ✓ Forms stack properly
- ✓ Buttons full width
- ✓ Text readable
- ✓ Touch targets > 44px

### Tablet (768px width)
- ✓ Settings tabs work
- ✓ Form centered
- ✓ All fields visible

### Desktop (1024px+ width)
- ✓ Centered layout
- ✓ Proper spacing
- ✓ All features work

## Accessibility Testing

- ✓ Tab navigation works
- ✓ Form labels present
- ✓ Error messages associated with fields
- ✓ Loading indicators announce state
- ✓ Password fields can be toggled
- ✓ Color contrast sufficient (WCAG AA)

## Regression Testing

After each change, verify:
1. Login still works
2. Password reset flow complete
3. Settings page functional
4. Protected routes work
5. Logout/401 handling works
6. Form validation active
7. Error messages display
8. Toast notifications show
9. Loading states present
10. Mobile responsive
