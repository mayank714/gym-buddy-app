'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { workoutService } from '@/services/workout.service';
import { CreateWorkoutDto, WorkoutStatus } from '@/types/workout.types';
import { getSession } from '@/utils/auth';
import { getAxiosErrorMessage } from '@/utils/helpers';

export function useWorkouts() {
  const session = getSession();
  return useQuery({
    queryKey: ['workouts', session?.id],
    queryFn: () => workoutService.getByUser(session!.id),
    enabled: !!session?.id,
  });
}

export function useTodaysWorkout() {
  const session = getSession();
  return useQuery({
    queryKey: ['workouts', session?.id, 'today'],
    queryFn: () => workoutService.getToday(session!.id),
    enabled: !!session?.id,
  });
}

export function useCompletedWorkouts() {
  const session = getSession();
  return useQuery({
    queryKey: ['workouts', session?.id, 'completed'],
    queryFn: () => workoutService.getCompleted(session!.id),
    enabled: !!session?.id,
  });
}

export function useWorkout(id: string) {
  return useQuery({
    queryKey: ['workout', id],
    queryFn: () => workoutService.getById(id),
    enabled: !!id,
  });
}

export function useCreateWorkout() {
  const qc = useQueryClient();
  const session = getSession();
  return useMutation({
    mutationFn: (dto: CreateWorkoutDto) => workoutService.create(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workouts', session?.id] });
      toast.success('Workout created!');
    },
    onError: (err) => toast.error(getAxiosErrorMessage(err)),
  });
}

export function useUpdateWorkoutStatus() {
  const qc = useQueryClient();
  const session = getSession();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: WorkoutStatus }) =>
      workoutService.updateStatus(id, status),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ['workouts', session?.id] });
      qc.invalidateQueries({ queryKey: ['workout', updated.id] });
      toast.success(`Workout marked as ${updated.status}!`);
    },
    onError: (err) => toast.error(getAxiosErrorMessage(err)),
  });
}

export function useDeleteWorkout() {
  const qc = useQueryClient();
  const session = getSession();
  return useMutation({
    mutationFn: (id: string) => workoutService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workouts', session?.id] });
      toast.success('Workout deleted.');
    },
    onError: (err) => toast.error(getAxiosErrorMessage(err)),
  });
}
