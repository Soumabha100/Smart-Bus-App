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

function parseApiError(response: Response, data: any, defaultFallback: string): Error & { details?: ApiError } {
  if (response.status === 502 || response.status === 503 || response.status === 504) {
    const serverDownMsg = `Backend server is unreachable (${response.status} Bad Gateway). Please make sure the Spring Boot backend is running on port 8080.`;
    const error = new Error(serverDownMsg) as Error & { details?: ApiError };
    error.details = { status: response.status, error: 'Bad Gateway', message: serverDownMsg };
    return error;
  }
  const errorMsg = data?.message || data?.error || `${defaultFallback} (${response.status})`;
  const error = new Error(errorMsg) as Error & { details?: ApiError };
  error.details = data;
  return error;
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
    throw parseApiError(response, data, 'Registration failed');
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
    throw parseApiError(response, data, 'Login failed');
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

export interface SendOtpPayload {
  phone: string;
}

export interface SendOtpResponse {
  message: string;
  success: boolean;
  phone: string;
  devOtp?: string;
}

export interface VerifyOtpPayload {
  phone: string;
  otp: string;
}

export async function sendOtp(payload: SendOtpPayload): Promise<SendOtpResponse> {
  const response = await fetch('/api/v1/auth/otp/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw parseApiError(response, data, 'Failed to send OTP');
  }

  return data as SendOtpResponse;
}

export async function verifyOtp(payload: VerifyOtpPayload): Promise<AuthResponse> {
  const response = await fetch('/api/v1/auth/otp/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw parseApiError(response, data, 'OTP verification failed');
  }

  return data as AuthResponse;
}

