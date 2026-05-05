'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { userService } from '@/services/user.service';
import { saveSession, clearSession, getSession } from '@/utils/auth';
import { CreateUserDto } from '@/types/user.types';
import { getAxiosErrorMessage } from '@/utils/helpers';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = useCallback(
    async (email: string) => {
      setLoading(true);
      try {
        const user = await userService.getByEmail(email);
        saveSession(user);
        toast.success(`Welcome back, ${user.name}!`);
        router.push('/dashboard');
      } catch {
        toast.error('No account found with that email. Please register first.');
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const register = useCallback(
    async (dto: CreateUserDto) => {
      setLoading(true);
      try {
        const user = await userService.create(dto);
        saveSession(user);
        toast.success(`Welcome to Gym Buddy, ${user.name}!`);
        router.push('/dashboard');
      } catch (err) {
        toast.error(getAxiosErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    clearSession();
    router.push('/login');
  }, [router]);

  const currentUser = getSession();

  return { login, register, logout, loading, currentUser };
}
