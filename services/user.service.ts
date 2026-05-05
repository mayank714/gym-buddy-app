import api from './api';
import { User, CreateUserDto, UpdateUserDto } from '@/types/user.types';
import { DeleteResponse } from '@/types/api.types';

export const userService = {
  create: (dto: CreateUserDto) =>
    api.post<User>('/users', dto).then((r) => r.data),

  getAll: () =>
    api.get<User[]>('/users').then((r) => r.data),

  getById: (id: string) =>
    api.get<User>(`/users/${id}`).then((r) => r.data),

  getByEmail: (email: string) =>
    api.get<User>(`/users/email/${encodeURIComponent(email)}`).then((r) => r.data),

  update: (id: string, dto: UpdateUserDto) =>
    api.put<User>(`/users/${id}`, dto).then((r) => r.data),

  delete: (id: string) =>
    api.delete<DeleteResponse>(`/users/${id}`).then((r) => r.data),
};
