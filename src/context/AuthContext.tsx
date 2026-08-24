import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  allUsers: User[];
  login: (identifier: string) => { success: boolean; error?: string };
  register: (data: {
    name: string;
    username: string;
    email: string;
    school: string;
    course: string;
    graduationYear: string | number;
    preferredRole: string;
    location?: string;
    skills?: string[];
    bio?: string;
  }) => { success: boolean; error?: string };
  logout: () => void;
  switchUser: (userId: string) => void;
  updateProfile: (updates: Partial<User>) => void;
  changePassword: (currentPass: string, newPass: string) => { success: boolean; message?: string; error?: string };
  refreshUsers: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUsers = useCallback(() => {
    const list = authService.getUsers();
    setAllUsers(list);
    const curr = authService.getCurrentUser();
    setUser(curr);
  }, []);

  useEffect(() => {
    authService.ensureInitialized();
    refreshUsers();
    setIsLoading(false);
  }, [refreshUsers]);

  const login = (identifier: string) => {
    const res = authService.login(identifier);
    if (res.success && res.user) {
      setUser(res.user);
      refreshUsers();
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const register = (data: {
    name: string;
    username: string;
    email: string;
    school: string;
    course: string;
    graduationYear: string;
    preferredRole: string;
    location?: string;
  }) => {
    const res = authService.register(data);
    if (res.success && res.user) {
      setUser(res.user);
      refreshUsers();
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const switchUser = (userId: string) => {
    const switched = authService.switchDemoAccount(userId);
    if (switched) {
      setUser(switched);
      refreshUsers();
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updated = authService.updateProfile(user.id, updates);
    if (updated) {
      setUser(updated);
      refreshUsers();
    }
  };

  const changePassword = (currentPass: string, newPass: string) => {
    if (!user) return { success: false, error: 'User not logged in' };
    return authService.changePassword(user.id, currentPass, newPass);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        allUsers,
        login,
        register,
        logout,
        switchUser,
        updateProfile,
        changePassword,
        refreshUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
