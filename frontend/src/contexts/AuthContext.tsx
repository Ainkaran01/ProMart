import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (user: User & { token: string }) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user session on startup
  useEffect(() => {
    const savedUser = localStorage.getItem('promart_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);

      // Set token in axios header for authenticated requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
    }
  }, []);

  const login = (user: User & { token: string }) => {
    setUser(user);
    localStorage.setItem('promart_user', JSON.stringify(user));

    // Attach token globally for API calls
    axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('promart_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
