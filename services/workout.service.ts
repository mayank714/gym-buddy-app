import api from './api';
import { Workout, CreateWorkoutDto, WorkoutStatus } from '@/types/workout.types';
import { DeleteResponse } from '@/types/api.types';

export const workoutService = {
  create: (dto: CreateWorkoutDto) =>
    api.post<Workout>('/workouts', dto).then((r) => r.data),

  getByUser: (userId: string) =>
    api.get<Workout[]>(`/workouts/user/${userId}`).then((r) => r.data),

  getById: (id: string) =>
    api.get<Workout>(`/workouts/${id}`).then((r) => r.data),

  getToday: (userId: string) =>
    api.get<Workout | null>(`/workouts/user/${userId}/today`).then((r) => r.data),

  getCompleted: (userId: string) =>
    api.get<Workout[]>(`/workouts/user/${userId}/completed`).then((r) => r.data),

  updateStatus: (id: string, status: WorkoutStatus) =>
    api.put<Workout>(`/workouts/${id}/status`, { status }).then((r) => r.data),

  delete: (id: string) =>
    api.delete<DeleteResponse>(`/workouts/${id}`).then((r) => r.data),
};
