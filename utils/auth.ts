import Cookies from 'js-cookie';
import { User } from '@/types/user.types';

const SESSION_KEY = 'gym-buddy-user';
const COOKIE_EXPIRES = 7;

export function saveSession(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  Cookies.set(SESSION_KEY, user.id, { expires: COOKIE_EXPIRES, path: '/' });
}

export function getSession(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
  Cookies.remove(SESSION_KEY, { path: '/' });
}

export function getSessionCookie(): string | undefined {
  return Cookies.get(SESSION_KEY);
}
