import { api } from './api';
import type { LoginResponse, User } from '@gridvision/shared';

export async function loginApi(username: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', { username, password });
  return data;
}

export async function refreshTokenApi(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  const { data } = await api.post('/auth/refresh', { refreshToken });
  return data;
}

export async function logoutApi(refreshToken: string): Promise<void> {
  await api.post('/auth/logout', { refreshToken });
}

export async function getProfileApi(): Promise<User> {
  const { data } = await api.get<User>('/auth/profile');
  return data;
}
