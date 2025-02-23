// src/auth/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, logout } from './AuthService';

type AuthContextType = {
  isAuthenticated: boolean;
  userName: string | null;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const name = await AsyncStorage.getItem('userName');
      if (token) {
        setIsAuthenticated(true);
        setUserName(name);
      }
    };
    loadUser();
  }, []);

  const loginUser = async (email: string, password: string) => {
    const user = await login(email, password);
    setIsAuthenticated(true);
    setUserName(user.name);
  };

  const logoutUser = async () => {
    await logout();
    setIsAuthenticated(false);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userName, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
