import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, getCurrentUser, login as storeLogin, logout as storeLogout, signUp as storeSignUp, changePassword as storeChangePassword } from '../store/authStore';

type AuthContextType = {
  user: User | null;
  isPending: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (username: string, email: string | undefined, password: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isPending, setIsPending] = useState(true);

  const refreshUser = useCallback(() => {
    setUser(getCurrentUser());
  }, []);

  useEffect(() => {
    setUser(getCurrentUser());
    setIsPending(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const result = storeLogin(username, password);
    if (result.success) setUser(getCurrentUser());
    return result;
  }, []);

  const signUp = useCallback(async (username: string, email: string | undefined, password: string) => {
    const result = storeSignUp(username, password, email);
    if (result.success) setUser(getCurrentUser());
    return result;
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    const res = storeChangePassword(user.id, currentPassword, newPassword);
    return res;
  }, [user]);

  const logout = useCallback(() => {
    storeLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isPending, login, signUp, logout, refreshUser, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
