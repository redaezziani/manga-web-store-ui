# User Data Persistence System

This document describes the user data persistence system that supports both localStorage and cookies for storing user authentication data and preferences.

## Overview

The system provides a unified interface for storing user data that can be easily switched between localStorage and cookies without changing application code. This flexibility allows for different deployment strategies and user preferences.

## Architecture

### Storage Configuration (`src/config/storage.ts`)

Central configuration file that controls storage behavior across the application:

```typescript
export const STORAGE_CONFIG = {
  // Change to 'cookies' to use cookies instead of localStorage
  type: 'localStorage' as StorageType,
  
  // Storage keys
  keys: {
    user: 'user-storage',
    preferences: 'user-preferences',
    theme: 'theme-preference',
  },
  
  // Cookie settings (only used when type is 'cookies')
  cookieOptions: {
    expires: 30, // days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  }
};
```

### Storage Types

#### localStorage (Default)
- **Pros**: Large storage capacity (5-10MB), synchronous API, automatic JSON handling
- **Cons**: Not accessible from server-side, domain-specific
- **Use case**: Development, SPAs, large user preferences

#### Cookies
- **Pros**: Available on server-side, sent with requests, cross-subdomain support
- **Cons**: Size limitations (4KB), sent with every request, requires careful security settings
- **Use case**: SSR applications, when server-side access is needed

## Implementation

### Core Components

1. **UnifiedStorage Class** (`src/lib/storage.ts`)
   - Provides consistent API regardless of storage type
   - Handles JSON serialization/deserialization
   - Manages cookie security settings

2. **User Store** (`src/stores/user-store.ts`)
   - Uses Zustand persist middleware with custom storage adapter
   - Automatically saves/restores authentication state
   - Supports token refresh and expiration

3. **Storage Manager Hook** (`src/hooks/use-storage-manager.ts`)
   - Provides utilities for managing stored data
   - Supports data export/import for migration
   - Debugging and status information

### Data Stored

The system persists the following user data:

```typescript
{
  user: User | null,           // User profile information
  accessToken: string | null,  // JWT access token
  refreshToken: string | null, // JWT refresh token
  expiresIn: number | null,    // Token expiration time
  isAuthenticated: boolean     // Authentication status
}
```

## Usage

### Switching Storage Types

To switch from localStorage to cookies:

1. Update `src/config/storage.ts`:
```typescript
export const STORAGE_CONFIG = {
  type: 'cookies' as StorageType,
  // ... rest of config
};
```

2. Optionally adjust cookie settings:
```typescript
cookieOptions: {
  expires: 7,        // 7 days instead of 30
  secure: true,      // Force HTTPS
  sameSite: 'lax',   // Allow some cross-site requests
}
```

### Using Storage Manager

```typescript
import { useStorageManager } from '@/hooks/use-storage-manager';

const MyComponent = () => {
  const {
    getCurrentStorageType,
    hasStoredUserData,
    clearStoredData,
    getStorageInfo
  } = useStorageManager();

  const handleClearData = () => {
    clearStoredData();
    // Data cleared from current storage type
  };

  const storageInfo = getStorageInfo();
  console.log(storageInfo);
  // {
  //   currentType: 'localStorage',
  //   hasUserData: true,
  //   isAuthenticated: true,
  //   keys: { user: 'user-storage', ... }
  // }
};
```

### Debug Component

For development, add the debug component to see storage status:

```typescript
import { StorageDebugInfo } from '@/components/debug/storage-debug-info';

// In your layout or page component
<StorageDebugInfo />
```

## Security Considerations

### Cookies
- **Secure flag**: Automatically enabled in production
- **SameSite**: Set to 'strict' by default to prevent CSRF
- **HttpOnly**: Not set (JavaScript needs access for authentication)
- **Expiration**: 30 days by default

### localStorage
- **XSS protection**: Vulnerable to XSS attacks
- **Domain isolation**: Data isolated per origin
- **No automatic expiration**: Manual cleanup required

## Migration Between Storage Types

When switching storage types, existing user sessions will be lost. To minimize impact:

1. **Planned Migration**:
   - Export user data before switching
   - Notify users of the change
   - Provide re-authentication flow

2. **Automatic Migration** (Future Enhancement):
   - Detect existing data in old storage
   - Copy to new storage type
   - Clean up old data

## API Reference

### Storage Configuration

```typescript
interface StorageConfig {
  type: 'localStorage' | 'cookies';
  keys: {
    user: string;
    preferences: string;
    theme: string;
  };
  cookieOptions: {
    expires: number;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
  };
}
```

### Storage Manager Hook

```typescript
interface StorageManager {
  getCurrentStorageType(): 'localStorage' | 'cookies';
  hasStoredUserData(): boolean;
  clearStoredData(): void;
  exportUserData(): object;
  getStorageInfo(): StorageInfo;
  logout(): void;
}
```

## Best Practices

1. **Choose storage type based on use case**:
   - Use localStorage for client-only applications
   - Use cookies for SSR or when server access is needed

2. **Security**:
   - Always use HTTPS in production when using cookies
   - Consider token expiration times
   - Implement proper logout cleanup

3. **Performance**:
   - localStorage is faster for large data
   - Cookies add overhead to HTTP requests

4. **User Experience**:
   - Provide clear session expiration messages
   - Allow users to stay logged in (remember me)
   - Handle storage errors gracefully

## Troubleshooting

### Common Issues

1. **Data not persisting**:
   - Check browser storage quotas
   - Verify storage type configuration
   - Check for incognito/private browsing

2. **Cookie issues**:
   - Verify domain settings
   - Check secure flag requirements
   - Review SameSite policy

3. **Token refresh failures**:
   - Check token expiration logic
   - Verify refresh endpoint availability
   - Review network connectivity

### Debug Tools

- Use `StorageDebugInfo` component in development
- Browser DevTools Application tab
- Network tab for cookie inspection
- Console logs for storage operations
