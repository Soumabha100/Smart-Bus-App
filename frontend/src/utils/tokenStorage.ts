const TOKEN_KEY = 'onego_jwt_token';
const LEGACY_TOKEN_KEY = 'roamly_jwt_token';
const USER_KEY = 'onego_user_data';
const LEGACY_USER_KEY = 'roamly_user_data';

export interface StoredUser {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: string;
  memberSince?: string;
  isStudent?: boolean;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  gender?: string;
  seatPreference?: 'lower_window' | 'upper_sleeper' | 'aisle' | 'any';
  whatsappNotifications?: boolean;
  smsNotifications?: boolean;
  [key: string]: unknown;
}

export const tokenStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getUser(): StoredUser | null {
    const raw = localStorage.getItem(USER_KEY) || localStorage.getItem(LEGACY_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredUser;
    } catch {
      return null;
    }
  },

  setUser(user: StoredUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(LEGACY_USER_KEY);
  },

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  },
};
