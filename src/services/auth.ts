import api from './api';

export interface AuthResponse {
  token: string;
  role: string;
  nom: string;
}

export interface RegisterData {
  email: string;
  password: string;
  role: string;
  nom: string;
  localisation?: string;
  competences?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const register = (data: RegisterData) =>
  api.post<AuthResponse>('/auth/register', data).then(r => r.data);

export const login = (data: LoginData) =>
  api.post<AuthResponse>('/auth/login', data).then(r => r.data);
