# Authentication System Documentation

This authentication system provides complete user management with JWT tokens, persistent login, and integration with the cart system.

## Features

### 🔐 Authentication
- User login and registration
- JWT token-based authentication
- Persistent login with localStorage
- Automatic token refresh
- Secure logout

### 👤 User Management  
- User profile with avatar support
- Display name, first/last name
- Email verification status
- Role-based access (USER, ADMIN)
- Account status tracking

### 🔗 Integration
- **Cart System**: Automatic auth headers for cart API calls
- **UserMenu**: Dynamic UI based on auth state
- **Protected Routes**: Auth-dependent component rendering

## API Integration

### Endpoints
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration  
- `POST /api/v1/auth/refresh` - Refresh access token

### Authentication Flow
1. User logs in with email/password
2. Server returns access token, refresh token, and user data
3. Tokens stored in localStorage (persistent)
4. Access token sent with all API requests as Bearer token
5. Automatic token refresh before expiration

## Usage Examples

### Login Form
```typescript
const { login, isLoading, error } = useAuth();

const handleLogin = async (credentials) => {
  await login({
    email: 'user@example.com',
    password: 'password123'
  });
};
```

### Protected Component
```typescript
const { isAuthenticated, user } = useAuth();

if (!isAuthenticated) {
  return <LoginForm />;
}

return <UserDashboard user={user} />;
```

### API Calls with Auth
```typescript
// Cart store automatically includes Bearer token
const headers = getAuthHeaders(); // Includes Authorization: Bearer <token>
```

## Components

### **LoginForm** (`src/components/auth/login-form.tsx`)
- Email/password form
- Loading states and error handling
- Switch to registration option
- Arabic RTL support

### **RegisterForm** (`src/components/auth/register-form.tsx`)
- Full user registration form
- Password confirmation validation
- Display name optional field
- Loading states and error handling

### **UserMenu** (`src/components/navbar-components/user-menu.tsx`)
- Shows login/register popover for guests
- User dropdown menu when authenticated
- Profile info display
- Logout functionality

## State Management

### **UserStore** (`src/stores/user-store.ts`)
- Zustand store with persistence
- User data and authentication state
- Token management
- API integration

### **useAuth Hook** (`src/stores/use-auth.ts`) 
- Simplified authentication interface
- Helper functions for user data
- Auto token status checking

## Data Structure

### User Object
```json
{
  "id": "user-id",
  "email": "user@example.com", 
  "firstName": "First",
  "lastName": "Last",
  "displayName": "Display Name",
  "avatar": "https://avatar-url.jpg",
  "role": "USER",
  "status": "ACTIVE", 
  "isEmailVerified": true,
  "createdAt": "2025-07-22T10:30:00.000Z"
}
```

### Authentication Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token", 
    "expiresIn": 1,
    "user": { /* User object */ }
  }
}
```

## Security Features

- **JWT Tokens**: Secure authentication tokens
- **Bearer Authentication**: Standard HTTP auth headers
- **Token Refresh**: Automatic token renewal
- **Persistent Sessions**: Survives browser refresh
- **Secure Logout**: Clears all stored tokens
- **Error Handling**: Graceful auth failure handling

## Files Structure

```
src/
├── stores/
│   ├── user-store.ts          # Main auth store
│   └── use-auth.ts            # Custom auth hook
├── components/auth/
│   ├── login-form.tsx         # Login component
│   └── register-form.tsx      # Registration component
├── components/navbar-components/
│   └── user-menu.tsx          # User menu with auth
├── types/
│   └── manga.ts              # Auth types
└── stores/
    └── cart-store.ts         # Updated with auth headers
```

## Integration with Cart System

The cart system automatically includes authentication:

1. **Auto Headers**: All cart API calls include Bearer token
2. **Auth Dependency**: Cart only loads when user is authenticated
3. **Error Handling**: Auth failures clear cart and redirect to login
4. **User Context**: Cart tied to authenticated user

## Helper Functions

### useAuth Hook Helpers
- `getDisplayName()` - User's display name
- `getFullName()` - First + last name  
- `getInitials()` - User initials for avatar
- `hasRole(role)` - Check user role
- `isAdmin()` - Check if admin user
- `isEmailVerified()` - Email verification status
- `getAuthHeader()` - Get Bearer token string

## UI Features

- **Responsive Design**: Works on all screen sizes
- **Arabic RTL**: Proper text direction
- **Loading States**: Visual feedback during auth
- **Error Messages**: User-friendly error display
- **Accessibility**: ARIA labels and semantic HTML
- **Form Validation**: Client-side validation
