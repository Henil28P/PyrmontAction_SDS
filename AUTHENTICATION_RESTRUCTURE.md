# Authentication System Restructure - Documentation

## Overview
The codebase has been restructured to properly separate authentication from user management, implement JWT middleware, and migrate from SQLite to MongoDB.

## Backend Changes

### 1. Authentication Controller (`/apps/authentication/authController.js`)
**Purpose**: Handles user registration, login, token refresh, and logout

**Endpoints**:
- `POST /api/authentication/join` - User registration
- `POST /api/authentication/login` - User login
- `POST /api/authentication/refresh-token` - Refresh access token
- `POST /api/authentication/logout` - User logout

**Features**:
- Password hashing using bcrypt
- JWT token generation (access + refresh tokens)
- Role assignment during registration
- MongoDB validation error handling
- Email uniqueness checking

### 2. User Controller (`/apps/user/userController.js`)
**Purpose**: Manages user account data and profile information

**Endpoints**:
- `GET /api/users/profile` - Get current user's profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users/all` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `PUT /api/users/:id/deactivate` - Deactivate user (admin only)

**Features**:
- Profile management (excluding email and role changes)
- Password change with current password verification
- Admin functions for user management
- Soft delete (deactivation) instead of hard delete

### 3. JWT Middleware (`/middlewares/jwtMiddleware.js`)
**Purpose**: Handles JWT operations and role-based authorization

**Functions**:
- `generateAccessToken()` - Creates access tokens (1 hour expiry)
- `generateRefreshToken()` - Creates refresh tokens (7 days expiry)
- `verifyAccessToken()` - Middleware to verify and decode tokens
- `verifyRefreshToken()` - Verifies refresh tokens
- `requireRole()` - Role-based access control middleware
- `requireAdmin()` - Admin-only access
- `requireMember()` - Member or admin access

**Features**:
- Automatic user lookup and role population
- Token expiry handling
- Role-based route protection
- User status checking (active/inactive)

### 4. Database Changes
**Removed Files**:
- `user.js` - Old SQLite code
- `userAuthentication.js` - Replaced by JWT middleware

**Role Seeding**:
- Automatic role creation on server startup
- Default roles: 'admin' and 'member'
- Seeding script in `seedRoles.js`

### 5. Environment Variables Required
```env
# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here

# Database
MONGODB_URI=mongodb://localhost:27017/pyrmont_sds

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# Server
PORT=5000
NODE_ENV=development
```

## Frontend Changes

### 1. Authentication Store (`/stores/auth.js`)
**Purpose**: Centralized state management for authentication using Pinia

**State**:
- `user` - Current user information
- `accessToken` - JWT access token
- `refreshToken` - JWT refresh token
- `isAuthenticated` - Authentication status
- `isLoading` - Loading state

**Actions**:
- `login()` - Authenticate user and store tokens
- `logout()` - Clear tokens and user data
- `refreshAccessToken()` - Refresh expired access tokens
- `hasRole()` - Check if user has required role
- `updateUserProfile()` - Update user profile data

**Getters**:
- `isAdmin` - Check if user is admin
- `isMember` - Check if user is member or admin
- `userName` - Get user's full name

### 2. Updated API Service (`/services/api.js`)
**Features**:
- Axios interceptors for automatic token handling
- Automatic token refresh on 403 responses
- Bearer token authentication
- Automatic redirect to login on auth failure
- Support for GET, POST, PUT, DELETE methods

### 3. Route Guards (`/router/authGuards.js`)
**Purpose**: Protect routes based on authentication and roles

**Guards**:
- `requireAuth()` - Requires authentication
- `requireRole()` - Requires specific role(s)
- `requireAdmin()` - Admin only access
- `requireMember()` - Member or admin access

**Features**:
- Automatic auth state initialization
- Redirect to login with return URL
- Role-based access control
- Unauthorized page redirect

### 4. Updated Login Component
**Changes**:
- Uses Pinia auth store
- Improved error handling
- Loading states
- Better UX with specific error messages
- Automatic redirection based on user role

## Usage Examples

### Backend Route Protection
```javascript
// Admin only route
router.get('/admin-data', verifyAccessToken, requireAdmin, (req, res) => {
  // Only admins can access this
});

// Member or admin route
router.get('/member-data', verifyAccessToken, requireMember, (req, res) => {
  // Members and admins can access this
});

// Custom role check
router.get('/custom', verifyAccessToken, requireRole(['admin', 'moderator']), (req, res) => {
  // Multiple roles allowed
});
```

### Frontend Route Protection
```javascript
// In route definition
{
  path: '/admin',
  component: AdminView,
  meta: { 
    requiresAuth: true,
    requiredRole: 'admin'
  }
}

// In component
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Check if user is admin
if (authStore.isAdmin) {
  // Show admin content
}

// Check specific role
if (authStore.hasRole('admin')) {
  // User has admin role
}
```

### API Calls
```javascript
// No need to manually handle tokens - interceptors handle it
import api from '@/services/api'

// Will automatically include Bearer token
const userProfile = await api.get('api/users/profile')

// Token refresh is automatic on 403 responses
const adminData = await api.get('api/admin/data')
```

## Migration Notes

### From SQLite to MongoDB
- All SQLite queries removed
- Mongoose models and schemas implemented
- Validation handled at model level
- Role IDs replaced with MongoDB ObjectIds

### Role System Changes
- No more hardcoded role IDs (0, 1)
- Roles stored as documents in MongoDB
- Role names used for checks ('admin', 'member')
- Role population in JWT tokens and API responses

### Token System
- Access tokens: 1 hour expiry
- Refresh tokens: 7 days expiry
- Automatic refresh in frontend
- Secure token storage in localStorage
- Token validation on every protected request

## Testing the System

### 1. Start Backend
```bash
cd backend
npm install
npm start
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Test Registration
```bash
curl -X POST http://localhost:5000/api/authentication/join \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "firstName": "Test",
    "lastName": "User",
    "mobilePhone": "0412345678",
    "areaOfInterest": "Testing",
    "streetName": "Test Street",
    "city": "Test City",
    "state": "NSW",
    "postcode": "2000"
  }'
```

### 4. Test Login
```bash
curl -X POST http://localhost:5000/api/authentication/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

### 5. Test Protected Route
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Security Features

### Backend
- Password hashing with bcrypt (salt rounds: 12)
- JWT token expiry (short-lived access tokens)
- Role-based access control
- Input validation with Mongoose
- CORS configuration
- Error handling without sensitive data exposure

### Frontend
- Secure token storage
- Automatic token refresh
- Route guards
- XSS protection through proper data handling
- Automatic logout on token expiry

## Troubleshooting

### Common Issues
1. **Token refresh failures**: Check refresh token expiry and backend availability
2. **Role access denied**: Verify user has correct role in database
3. **CORS errors**: Ensure FRONTEND_URL is set correctly in backend .env
4. **Database connection**: Verify MONGODB_URI in .env file

### Environment Setup
Make sure to create `.env` files in both backend and frontend with appropriate values for your environment.