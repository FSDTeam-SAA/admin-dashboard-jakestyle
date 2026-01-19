# API Reference Guide

## Base Configuration

**Base URL**: `NEXT_PUBLIC_API_URL` (default: http://localhost:3000)

**Authentication**: All requests require `Authorization: Bearer {token}` header

**Token**: Automatically injected via Axios interceptor in `/lib/api.ts`

## User Management Endpoints

### Get All Users
```
GET /api/v1/admin/users?page=1&limit=10
```
**Usage**: `/admin/users` page
**Returns**: Array of user objects with pagination

**Response Example**:
```json
{
  "success": true,
  "message": "Users fetched",
  "data": [
    {
      "_id": "userId",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "tradesperson",
      "accountStatus": "pending",
      "profileImage": { "url": "..." },
      "createdAt": "2026-01-15T03:41:03.708Z"
    }
  ]
}
```

### Get Single User
```
GET /api/v1/admin/users/{userId}
```
**Usage**: `/admin/users/[id]` page
**Returns**: Single user object with full details

### Update User Status
```
PATCH /api/v1/admin/users/{userId}/status
Content-Type: application/json

{
  "action": "approve" | "reject" | "suspend"
}
```
**Usage**: Approve/Reject buttons on user details page
**Actions**:
- `approve`: Set account status to approved
- `reject`: Set account status to rejected
- `suspend`: Suspend user account

### Delete User
```
DELETE /api/v1/admin/users/{userId}
```
**Usage**: Delete button with modal confirmation
**Returns**: Confirmation message

---

## Category Management Endpoints

### Get All Categories (Admin)
```
GET /api/v1/admin/categories?page=1&limit=10
```
**Usage**: `/admin/categories` page
**Returns**: All categories (pending, approved, rejected)

**Response Example**:
```json
{
  "success": true,
  "message": "Categories fetched",
  "data": [
    {
      "_id": "categoryId",
      "name": "Electrician",
      "status": "pending",
      "createdByTradespersonId": "tradespersonId",
      "createdAt": "2026-01-11T04:05:17.447Z"
    }
  ]
}
```

### Get Approved Categories
```
GET /api/v1/categories?page=1&limit=10
```
**Usage**: Public category listing (reference)
**Returns**: Only approved categories

### Get Single Category
```
GET /api/v1/admin/categories/{categoryId}
```
**Usage**: `/admin/categories/[id]` page
**Returns**: Single category with full details

### Update Category Status
```
PATCH /api/v1/admin/categories/{categoryId}
Content-Type: application/json

{
  "status": "pending" | "approved" | "rejected"
}
```
**Usage**: Status update on category details page
**Status Values**:
- `pending`: Category awaiting review
- `approved`: Category approved and active
- `rejected`: Category rejected

### Delete Category
```
DELETE /api/v1/admin/categories/{categoryId}
```
**Usage**: Delete button with modal confirmation

---

## Job Management Endpoints

### Get All Jobs
```
GET /api/v1/jobs/near-you?page=1&limit=10
```
**Usage**: `/admin/jobs` page
**Returns**: Array of job objects

**Response Example**:
```json
{
  "success": true,
  "message": "Jobs fetched successfully",
  "data": [
    {
      "_id": "jobId",
      "title": "Fix leaky roof",
      "description": "...",
      "status": "open_to_quotes",
      "category": { "_id": "...", "name": "Builder" },
      "media": ["url1", "url2"],
      "locationText": "123 Main St",
      "createdAt": "2026-01-12T06:52:48.373Z"
    }
  ]
}
```

### Get Single Job
```
GET /api/v1/jobs/{jobId}
```
**Usage**: `/admin/jobs/[id]` page
**Returns**: Single job with full details

**Response Example**:
```json
{
  "success": true,
  "data": {
    "_id": "jobId",
    "title": "string",
    "description": "string",
    "media": ["url1", "url2"],
    "locationText": "string",
    "locationGeo": {
      "type": "Point",
      "coordinates": [90.3890144, 23.7643863]
    },
    "status": "open_to_quotes" | "in_progress" | "completed" | "closed",
    "category": { "_id": "...", "name": "..." },
    "homeownerId": "userId",
    "moderatedByAdmin": false,
    "visibility": "public" | "private",
    "createdAt": "ISO Date"
  }
}
```

---

## Application Management Endpoints

### Get All Applications
```
GET /api/v1/admin/applications?page=1&limit=10
```
**Usage**: `/admin/applications` page
**Returns**: Array of application objects

### Get Single Application
```
GET /api/v1/admin/applications/{applicationId}
```
**Usage**: `/admin/applications/[id]` page
**Returns**: Single application with full details

**Response Example**:
```json
{
  "success": true,
  "data": {
    "_id": "applicationId",
    "jobId": "jobId",
    "tradespersonId": "tradespersonId",
    "status": "pending" | "accepted" | "rejected" | "withdrawn",
    "coverLetter": "string",
    "quotedPrice": 500,
    "estimatedDays": 3,
    "createdAt": "ISO Date"
  }
}
```

---

## Review Management Endpoints

### Get All Reviews
```
GET /api/v1/admin/reviews?page=1&limit=10
```
**Usage**: `/admin/reviews` page
**Returns**: Array of review objects

**Response Example**:
```json
{
  "success": true,
  "message": "Reviews fetched",
  "data": [
    {
      "_id": "reviewId",
      "rating": 5,
      "text": "Great service",
      "status": "pending" | "approved" | "rejected" | "edited",
      "reviewerName": "John",
      "createdAt": "ISO Date"
    }
  ]
}
```

### Get Single Review
```
GET /api/v1/reviews/{reviewId}
```
**Usage**: `/admin/reviews/[id]` page
**Returns**: Single review with full details

### Update Review Status
```
PATCH /api/v1/reviews/{reviewId}
Content-Type: application/json

{
  "action": "approve" | "reject" | "edit",
  "editedText": "string (optional, required if action='edit')",
  "adminNote": "string (optional)"
}
```
**Usage**: Review moderation page
**Actions**:
- `approve`: Approve the review as-is
- `reject`: Reject the review
- `edit`: Edit review text and approve with changes

**Response Example**:
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Review updated",
  "data": {
    "_id": "reviewId",
    "status": "approved",
    "adminEditedText": "edited text if edited",
    "adminNote": "admin note if provided"
  }
}
```

---

## Dashboard Statistics Endpoints

These endpoints are used with `limit=1` to get quick statistics:

### Users Count
```
GET /api/v1/admin/users?limit=1
```
Returns total user count in response metadata

### Categories Count
```
GET /api/v1/admin/categories?limit=1
```
Returns total category count

### Jobs Count
```
GET /api/v1/jobs/near-you?limit=1
```
Returns total job count

---

## Authentication & Error Handling

### Request Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Success Response
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "statusCode": 400 | 401 | 404 | 500,
  "success": false,
  "message": "Error description"
}
```

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad request (validation error)
- `401`: Unauthorized (invalid/expired token)
- `404`: Not found
- `500`: Server error

---

## Pagination Parameters

**Query Parameters**:
- `page`: Page number (starts at 1)
- `limit`: Items per page (default: 10)

**Example**:
```
GET /api/v1/admin/users?page=2&limit=20
```

---

## Status Enums

### User Account Status
- `pending`: Awaiting admin approval
- `approved`: Account is active
- `rejected`: Account rejected
- `suspended`: Account suspended

### Job Status
- `open_to_quotes`: Accepting bids
- `in_progress`: Work in progress
- `completed`: Work completed
- `closed`: Job closed

### Category Status
- `pending`: Awaiting approval
- `approved`: Active category
- `rejected`: Rejected category

### Application Status
- `pending`: Awaiting response
- `accepted`: Application accepted
- `rejected`: Application rejected
- `withdrawn`: Application withdrawn

### Review Status
- `pending`: Awaiting moderation
- `approved`: Approved review
- `rejected`: Rejected review
- `edited`: Admin edited and approved

---

## Client Usage Examples

### Using the API Client (`lib/api.ts`)

```typescript
// Import API functions
import { usersAPI, categoriesAPI, jobsAPI, applicationsAPI, reviewsAPI } from '@/lib/api';

// Get all users
const response = await usersAPI.getAll(1, 10);

// Update user status
await usersAPI.updateStatus(userId, 'approve');

// Delete user
await usersAPI.delete(userId);

// Update category status
await categoriesAPI.updateStatus(categoryId, 'approved');

// Delete category
await categoriesAPI.delete(categoryId);

// Update review
await reviewsAPI.updateStatus(reviewId, 'approve', 'edited text', 'admin note');
```

### Using with SWR

```typescript
import useSWR from 'swr';
import api from '@/lib/api';

const fetcher = async (url: string) => {
  const response = await api.get(url);
  return response.data.data;
};

const { data, isLoading, mutate } = useSWR(
  `/api/v1/admin/users?page=1&limit=10`,
  fetcher
);

// Refresh data
mutate();
```

---

## Rate Limiting

No rate limiting information provided. Adjust as needed per backend configuration.

---

## CORS Configuration

CORS should be enabled on the backend to allow requests from:
- `http://localhost:3000` (development)
- Your production domain

---

## Documentation Links

- Backend API Documentation: Check with your API provider
- Axios Documentation: https://axios-http.com/
- SWR Documentation: https://swr.vercel.app/
