export interface Exercise {
  name: string;
  sets: number;
  reps: string | number;
  rest?: string;
  notes?: string;
}

export type WorkoutStatus = 'planned' | 'in-progress' | 'completed';

export interface Workout {
  id: string;
  userId: string;
  date: string;
  name: string;
  exercises: string;
  duration?: number;
  difficulty?: string;
  status: WorkoutStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateWorkoutDto {
  userId: string;
  name: string;
  exercises: Exercise[];
  difficulty?: string;
}

export interface UpdateWorkoutStatusDto {
  status: WorkoutStatus;
}
