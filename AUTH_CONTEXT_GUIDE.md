# Global Authentication State - AuthContext

## Overview
AuthContext provides global state management for user authentication across the entire application. It automatically stores user information after login and makes it available to all components.

## Setup

### 1. AuthContext Provider
The `AuthProvider` is already wrapped around the entire app in `src/app/layout.tsx`:

```tsx
<AuthProvider>
  {children}
</AuthProvider>
```

### 2. Using AuthContext in Components

Import the `useAuth` hook:

```tsx
import { useAuth } from '@/contexts/AuthContext';
```

### 3. Available Properties and Methods

```tsx
const {
  user,           // UserProfile | null - Full user profile object
  userId,         // string | null - Quick access to user ID
  loading,        // boolean - Auth state loading
  error,          // string | null - Auth error message
  isAuthenticated, // boolean - Whether user is logged in
  login,          // (email, password) => Promise<boolean> - Login function
  logout,         // () => Promise<void> - Logout function
  refetch,        // () => Promise<void> - Refresh user data
} = useAuth();
```

## Usage Examples

### Example 1: Worker Dashboard
```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkerDashboard() {
  const { user, userId, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // Use userId to fetch user-specific data
    if (userId) {
      fetchMyAssignments();
    }
  }, [isAuthenticated, userId]);

  return (
    <div>
      <h1>Welcome, {user?.username}!</h1>
      <p>User ID: {userId}</p>
    </div>
  );
}
```

### Example 2: Login Page
```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const success = await login(email, password);
    
    if (success) {
      router.push('/worker-dashboard');
    } else {
      alert('Login failed');
    }
  };

  return (
    <div>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
```

### Example 3: Navigation Component
```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // User is logged out, AuthContext automatically updates
  };

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <span>Hello, {user?.username}!</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <Link href="/login">Sign In</Link>
      )}
    </nav>
  );
}
```

### Example 4: Protected Route
```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading]);

  // Show loading while checking auth
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show nothing if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return <div>Protected Content</div>;
}
```

### Example 5: API Call with User ID
```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { assignmentsApi } from '@/api';

export default function MyTasks() {
  const { userId, isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (isAuthenticated && userId) {
      // Use userId for API calls
      assignmentsApi.getMyAssignments()
        .then(response => {
          if (response.success) {
            setTasks(response.data);
          }
        });
    }
  }, [userId, isAuthenticated]);

  return (
    <div>
      <h1>My Tasks (User ID: {userId})</h1>
      {tasks.map(task => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  );
}
```

## User Profile Type

The `user` object contains:

```typescript
interface UserProfile {
  id: string;
  email: string;
  username: string;
  role: 'worker' | 'client' | 'admin';
  isActive: boolean;
  createdAt: string;
  // ... other profile fields
}
```

## How It Works

1. **Initial Load**: On app start, AuthContext checks localStorage for `accessToken`
2. **Token Found**: Fetches user profile from `/api/users/profile`
3. **Login**: Calls `/api/auth/login`, stores token, fetches profile
4. **Logout**: Calls `/api/auth/logout`, clears token and user state
5. **Auto-Sync**: All components using `useAuth()` automatically get updated state

## Token Management

- **Storage**: JWT token stored in `localStorage` as `accessToken`
- **Auto-Include**: All API calls automatically include `Authorization: Bearer <token>`
- **Expiry**: Token cleared on logout or auth error
- **Refresh**: Use `refetch()` to manually refresh user data

## Benefits

✅ **Global State**: User data available everywhere without prop drilling  
✅ **Auto-Redirect**: Easy to implement login checks  
✅ **Type-Safe**: Full TypeScript support  
✅ **Performance**: Single source of truth, no duplicate API calls  
✅ **Persistence**: Token survives page refresh  

## Migration from Old Code

### Before (Manual Auth)
```tsx
const [userId, setUserId] = useState(null);

// Manual token check
useEffect(() => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    router.push('/login');
  }
}, []);
```

### After (AuthContext)
```tsx
const { userId, isAuthenticated } = useAuth();

useEffect(() => {
  if (!isAuthenticated) {
    router.push('/login');
  }
}, [isAuthenticated]);
```

## Troubleshooting

### User is null after login
- Check if token is stored: `localStorage.getItem('accessToken')`
- Check network tab for `/api/users/profile` call
- Verify token is valid (not expired)

### Components not updating
- Make sure component is wrapped in `<AuthProvider>`
- Check if using `useAuth()` hook correctly
- Verify component is client-side (`'use client'`)

### Redirect loops
- Check if protected page redirects to login
- Check if login page redirects back correctly
- Avoid multiple redirect logic in same component

---

**File Location**: `src/contexts/AuthContext.tsx`  
**Hook**: `useAuth()`  
**Provider**: `<AuthProvider>`  
**Storage**: `localStorage.accessToken`
