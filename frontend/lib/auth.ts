import { UserRole } from './user-roles';

export type UserInfo = {
  id: number;
  email: string;
  role: UserRole;
};

const tokenKey = 'train-schedule-token';

export function storeToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(tokenKey, token);
}

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(tokenKey);
}

export function clearToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(tokenKey);
}

export function decodeUser(token: string): UserInfo | null {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const data = JSON.parse(decoded);
    return {
      id: data.sub,
      email: data.email,
      role: data.role,
    };
  } catch {
    return null;
  }
}
