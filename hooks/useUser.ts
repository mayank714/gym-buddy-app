'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { userService } from '@/services/user.service';
import { UpdateUserDto } from '@/types/user.types';
import { saveSession, getSession } from '@/utils/auth';
import { getAxiosErrorMessage } from '@/utils/helpers';

export function useCurrentUser() {
  const session = getSession();
  return useQuery({
    queryKey: ['user', session?.id],
    queryFn: () => userService.getById(session!.id),
    enabled: !!session?.id,
    staleTime: 60 * 1000,
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  const session = getSession();

  return useMutation({
    mutationFn: (dto: UpdateUserDto) => userService.update(session!.id, dto),
    onSuccess: (updated) => {
      saveSession(updated);
      qc.invalidateQueries({ queryKey: ['user', session?.id] });
      toast.success('Profile updated!');
    },
    onError: (err) => toast.error(getAxiosErrorMessage(err)),
  });
}
