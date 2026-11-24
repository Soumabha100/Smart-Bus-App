import { useState, useEffect, useCallback, type FC, type ReactNode } from 'react';
import { tokenStorage, type StoredUser } from '../utils/tokenStorage';
import { AuthContext } from './authContextInstance';
import { logoutUser } from '../api/authApi';

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<StoredUser | null>(() => tokenStorage.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => tokenStorage.isAuthenticated());

  // Keep state synchronized with localStorage across windows/tabs
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(tokenStorage.getUser());
      setIsAuthenticated(tokenStorage.isAuthenticated());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = useCallback((userData: StoredUser, token: string = 'onego_jwt_token_sample') => {
    tokenStorage.setToken(token);
    tokenStorage.setUser(userData);
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn('Failed to notify backend on logout:', err);
    } finally {
      tokenStorage.clear();
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const updateUser = useCallback((partialData: Partial<StoredUser>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...partialData };
      tokenStorage.setUser(updated);
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
