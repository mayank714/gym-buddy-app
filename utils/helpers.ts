import { WorkoutStatus } from '@/types/workout.types';
import { Exercise } from '@/types/workout.types';

export function parseExercises(raw: string): Exercise[] {
  try {
    return JSON.parse(raw) as Exercise[];
  } catch {
    return [];
  }
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDuration(minutes?: number): string {
  if (!minutes) return '—';
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function statusColor(status: WorkoutStatus): string {
  switch (status) {
    case 'completed':
      return 'text-green-400 bg-green-400/10';
    case 'in-progress':
      return 'text-amber-400 bg-amber-400/10';
    case 'planned':
    default:
      return 'text-slate-400 bg-slate-400/10';
  }
}

export function getFitnessLevelLabel(level?: string): string {
  const map: Record<string, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  };
  return level ? (map[level] ?? level) : 'Not set';
}

export function getAxiosErrorMessage(error: unknown): string {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    (error as { response?: { data?: { message?: string } } }).response?.data?.message
  ) {
    return (error as { response: { data: { message: string } } }).response.data.message;
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong';
}
