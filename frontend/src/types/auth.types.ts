export interface RegisterData {
  email: string;
  password1: string;
  password2: string;
  first_name?: string;
  last_name?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  date_joined: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface ApiError {
  detail?: string;
  message?: string;
  [key: string]: unknown;
}
