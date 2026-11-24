import { createContext } from 'react';
import type { StoredUser } from '../utils/tokenStorage';

export interface AuthContextType {
  user: StoredUser | null;
  isAuthenticated: boolean;
  login: (userData: StoredUser, token?: string) => void;
  logout: () => Promise<void> | void;
  updateUser: (partialData: Partial<StoredUser>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
