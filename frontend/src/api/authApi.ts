export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface BackendUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: BackendUser;
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  validationErrors?: Record<string, string>;
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await fetch('/api/v1/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `Registration failed (${response.status})`;
    const error = new Error(errorMsg) as Error & { details?: ApiError };
    error.details = data;
    throw error;
  }

  return data as AuthResponse;
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `Login failed (${response.status})`;
    const error = new Error(errorMsg) as Error & { details?: ApiError };
    error.details = data;
    throw error;
  }

  return data as AuthResponse;
}

export async function logoutUser(): Promise<void> {
  try {
    await fetch('/api/v1/auth/logout', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    });
  } catch (err) {
    console.warn('Backend logout notification failed or timed out:', err);
  }
}

