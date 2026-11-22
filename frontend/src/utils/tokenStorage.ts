const TOKEN_KEY = 'roamly_jwt_token';
const USER_KEY = 'roamly_user_data';

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
  seatPreference?: string;
  whatsappNotifications?: boolean;
  smsNotifications?: boolean;
  [key: string]: unknown;
}

export const tokenStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getUser(): StoredUser | null {
    const raw = localStorage.getItem(USER_KEY);
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
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  },
};

