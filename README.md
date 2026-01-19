# TRADIES Admin Dashboard

A comprehensive admin dashboard for the TRADIES platform built with Next.js 16, featuring user management, category moderation, job management, application tracking, and review moderation.

## Features

### 1. Dashboard Overview
- Real-time statistics (Total Tradespeople, Homeowners, Jobs Posted)
- Job Posted bar chart (weekly metrics)
- User Growth line chart (tracking user trends)
- Responsive design with smooth transitions

### 2. User Management
- View all users with pagination
- User details page with full information
- Approve/Reject user accounts
- Edit user information
- Delete users with confirmation modal
- Profile image display from API

### 3. Category Management
- Browse all categories with pending/approved/rejected status
- Update category status
- Delete categories with modal confirmation
- Status badges with visual indicators

### 4. Job Management
- View all jobs with filtering by status
- Single job details with full information
- Media gallery for job images
- Location and timeline information
- Job statistics (quotes, views, applications)

### 5. Applications Management
- Track all job applications
- View application details
- See tradesperson information
- Track quoted prices and estimated days
- Application status history

### 6. Reviews Moderation
- Review pending, approved, rejected, and edited reviews
- Star rating display
- Approve reviews
- Reject reviews with reasons
- Edit review text
- Add admin notes for internal reference
- Track admin edits and notes

### 7. Settings
- Email notification preferences
- Security settings
- API configuration

## Technology Stack

- **Frontend**: Next.js 16 with React 19.2
- **State Management**: SWR for data fetching and caching
- **UI Components**: shadcn/ui components
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios with interceptors
- **Toast Notifications**: Sonner
- **Charts**: Recharts
- **Icons**: Lucide React

## Setup Instructions

### 1. Environment Configuration

Set your API base URL in the environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 2. Install Dependencies

The project uses automatic dependency detection. Ensure all required packages are available:

```bash
npm install
```

### 3. Authentication

The admin dashboard uses JWT token-based authentication:

1. **Login Page**: Access at `/` to login with admin credentials
2. **Token Storage**: Token is stored in localStorage via `setAuthToken()`
3. **Axios Interceptor**: Automatically attaches token to all API requests
4. **Token Refresh**: Implement token refresh logic as needed

**Demo Token** (provided in requirements):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTZjYmZkMjA4MDI5YzNkNjg3OGFhNjMiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2ODc4OTY0MSwiZXhwIjoxNzY4ODc2MDQxfQ.QAwzSRb8VMwJlEvmueRw_RNzfN78qr7JroDpKIjqCtM
```

### 4. API Endpoints

All API endpoints are configured in `/lib/api.ts`:

#### Users
- `GET /api/v1/admin/users` - Get all users (paginated)
- `GET /api/v1/admin/users/{userId}` - Get single user
- `PATCH /api/v1/admin/users/{userId}/status` - Update user status
- `DELETE /api/v1/admin/users/{userId}` - Delete user

#### Categories
- `GET /api/v1/admin/categories` - Get all categories (paginated)
- `GET /api/v1/categories` - Get approved categories only
- `GET /api/v1/admin/categories/{categoryId}` - Get category details
- `PATCH /api/v1/admin/categories/{categoryId}` - Update category status
- `DELETE /api/v1/admin/categories/{categoryId}` - Delete category

#### Jobs
- `GET /api/v1/jobs/near-you` - Get all jobs (paginated)
- `GET /api/v1/jobs/{jobId}` - Get job details

#### Applications
- `GET /api/v1/admin/applications` - Get all applications (paginated)
- `GET /api/v1/admin/applications/{applicationId}` - Get application details

#### Reviews
- `GET /api/v1/admin/reviews` - Get all reviews (paginated)
- `GET /api/v1/reviews/{reviewId}` - Get review details
- `PATCH /api/v1/reviews/{reviewId}` - Update review (approve/reject/edit)

## Project Structure

```
app/
├── admin/
│   ├── layout.tsx              # Admin dashboard layout with sidebar
│   ├── page.tsx                # Dashboard overview
│   ├── users/
│   │   ├── page.tsx            # Users list
│   │   └── [id]/
│   │       ├── page.tsx        # User details
│   │       └── edit/page.tsx   # Edit user
│   ├── categories/
│   │   ├── page.tsx            # Categories list
│   │   └── [id]/page.tsx       # Category details
│   ├── jobs/
│   │   ├── page.tsx            # Jobs list
│   │   └── [id]/page.tsx       # Job details
│   ├── applications/
│   │   ├── page.tsx            # Applications list
│   │   └── [id]/page.tsx       # Application details
│   ├── reviews/
│   │   ├── page.tsx            # Reviews list
│   │   └── [id]/page.tsx       # Review moderation
│   └── settings/page.tsx       # Admin settings
├── page.tsx                    # Login page
└── layout.tsx                  # Root layout

components/
├── ui/                         # shadcn/ui components
├── DeleteModal.tsx             # Reusable delete confirmation modal
├── ApproveRejectModal.tsx      # Approve/Reject action modal
└── StatusUpdateModal.tsx       # Status update modal

lib/
└── api.ts                      # Axios instance & API endpoints

styles/
└── globals.css                 # Global styles with Tailwind
```

## Key Components

### API Client (`lib/api.ts`)
- Axios instance with automatic token injection
- Request/Response interceptors
- Organized API endpoint groups (users, categories, jobs, etc.)
- Token management utilities

### Modals
- **DeleteModal**: Confirm deletion of any resource
- **ApproveRejectModal**: Approve/Reject actions with optional reasons
- **StatusUpdateModal**: Update status with visual indicators

### Data Fetching
- Uses SWR for efficient client-side caching
- Automatic revalidation on tab focus
- Loading skeletons for better UX
- Error toast notifications

## Pagination

All list pages include pagination with:
- Previous/Next buttons
- Page number selection
- 10 items per page (customizable)
- Skeleton loading states

## Status Badges

Color-coded status indicators:
- **Pending**: Yellow
- **Approved**: Green
- **Rejected**: Red
- **Edited**: Blue (Reviews)

## Form Handling

All forms include:
- Input validation
- Loading states during submission
- Success/Error toast notifications
- Disabled state during API calls

## Responsive Design

- Mobile-first approach
- Sidebar collapses on small screens
- Responsive tables with horizontal scrolling
- Touch-friendly button sizes
- Responsive grid layouts

## Development

### Running the App

```bash
npm run dev
```

Access at `http://localhost:3000`

### Building for Production

```bash
npm run build
npm start
```

## API Integration Notes

1. **Token Management**:
   - Token is automatically added to all requests
   - Handle 401 responses for token expiration
   - Implement token refresh logic as needed

2. **Error Handling**:
   - All API calls wrapped in try-catch
   - User-friendly error messages via toast
   - Server error details logged for debugging

3. **Loading States**:
   - Skeleton loaders during data fetch
   - Button disabled states during submissions
   - Modal loading indicators

4. **Data Caching**:
   - SWR handles automatic caching
   - Mutate function available for manual refresh
   - Configurable revalidation time

## Design System

### Colors
- Primary: Blue (#3B82F6)
- Success: Green (#22C55E)
- Danger: Red (#EF4444)
- Warning: Yellow (#EAB308)
- Sidebar: Light Blue (#E0F2FE)
- Brand: Orange (#D97706)

### Typography
- Font Family: Geist (default Next.js font)
- Responsive sizing: Mobile-first breakpoints

### Spacing
- Uses Tailwind spacing scale (4px increments)
- Consistent padding/margin throughout

## Browser Support

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)

## Performance Optimizations

- Image optimization with Next.js Image component
- Lazy loading for routes
- SWR caching for reduced API calls
- Debounced search/filter inputs
- Skeleton loaders for perceived performance

## Future Enhancements

- Dark mode support
- Advanced filtering and search
- Bulk operations on users/jobs
- Export functionality (CSV/PDF)
- Admin activity logs
- Email notification integration
- Multi-language support

## Troubleshooting

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS configuration on backend
- Ensure token is valid and not expired

### Data Not Loading
- Check browser console for errors
- Verify API endpoints are correct
- Check network tab in DevTools
- Ensure authentication token is present

### Styling Issues
- Clear browser cache
- Rebuild with `npm run build`
- Check Tailwind configuration

## Support

For issues or questions, please refer to the API documentation or contact the development team.
