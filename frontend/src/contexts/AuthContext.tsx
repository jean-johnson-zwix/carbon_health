import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';

// Define the shape of the user data and the context
interface User {
  username: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, username: string) => void;
  logout: () => void;
}

// Create the context with a default value of undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // On initial load, check localStorage for existing auth data
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    if (token && username) {
      setUser({ token, username });
    }
  }, []);

  // Login function updates state and localStorage
  const login = (token: string, username: string) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('username', username);
    setUser({ token, username });
  };

  // Logout function clears state and localStorage
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setUser(null);
  };

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Create a custom hook for easy access to the context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}