# Authentication Context

A lightweight, client-side authentication context for the Vehicle Rental Service application.

## Features

- ✅ User state management with localStorage persistence
- ✅ Async login/logout with error handling
- ✅ Built-in authentication status checks
- ✅ Admin role support
- ✅ Error state management
- ✅ TypeScript support with full type safety

## Usage

### 1. Wrap your app with AuthProvider

In your root layout or app component:

```tsx
import { AuthProvider } from "@/lib/auth-context";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 2. Use the auth hook in components

```tsx
"use client";

import { useAuth } from "@/lib/auth-context";

export default function UserProfile() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
```

### 3. Login example

```tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function LoginForm() {
  const { login, error, clearError } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({
        id: "user123",
        name: "John Doe",
        email: "john@example.com",
        avatar: "https://...",
        isAdmin: false,
      });
      // User is now authenticated
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && (
        <div className="text-red-500">
          {error}
          <button onClick={clearError} type="button">✕</button>
        </div>
      )}
      {/* form fields */}
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
```

### 4. Use convenience hooks

```tsx
"use client";

import { useIsAuthenticated, useIsAdmin } from "@/lib/auth-context";

export default function AdminPanel() {
  const isAuthenticated = useIsAuthenticated();
  const isAdmin = useIsAdmin();

  if (!isAuthenticated) return <div>Please login</div>;
  if (!isAdmin) return <div>Admin access required</div>;

  return <div>Admin Dashboard</div>;
}
```

## API

### `useAuth()`

Main hook to access auth context.

**Returns:**
```typescript
{
  user: User | null;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  clearError: () => void;
}
```

### `useIsAuthenticated()`

Quick check if user is logged in.

**Returns:** `boolean`

### `useIsAdmin()`

Quick check if user has admin role.

**Returns:** `boolean`

## Integration with API

Replace the TODO comments in `login()` and `logout()` functions:

```tsx
const login = useCallback(async (userData: Exclude<User, null>) => {
  try {
    setError(null);
    
    // Call your API
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) throw new Error("Login failed");
    const user = await response.json();

    setUser(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (err) {
    // Error handling...
  }
}, []);
```

## Notes

- User data is persisted in localStorage under the key `vehicle_rental_user`
- All login/logout operations are async (ready for API integration)
- Error state is automatically cleared when retrying operations
- The context validates stored user data on app load
