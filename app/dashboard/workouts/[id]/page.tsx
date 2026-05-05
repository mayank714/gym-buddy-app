'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Dumbbell, Clock, Calendar, CheckCircle, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { useWorkout, useUpdateWorkoutStatus } from '@/hooks/useWorkouts';
import { parseExercises, formatDate, formatDuration } from '@/utils/helpers';
import { WorkoutStatus } from '@/types/workout.types';

export default function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: workout, isLoading } = useWorkout(id);
  const updateStatus = useUpdateWorkoutStatus();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Workout not found.</p>
        <Button variant="ghost" className="mt-4" onClick={() => router.back()}>
          Go back
        </Button>
      </div>
    );
  }

  const exercises = parseExercises(workout.exercises);

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to workouts
      </button>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">{workout.name}</h1>
          <div className="flex items-center gap-3 text-sm text-slate-400 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(workout.date)}
            </span>
            {workout.duration && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {formatDuration(workout.duration)}
              </span>
            )}
            {workout.difficulty && (
              <span className="capitalize">{workout.difficulty}</span>
            )}
          </div>
        </div>
        <Badge variant={workout.status as WorkoutStatus}>{workout.status}</Badge>
      </div>

      <div className="flex gap-2 mb-6">
        {workout.status === 'planned' && (
          <Button
            loading={updateStatus.isPending}
            onClick={() => updateStatus.mutate({ id: workout.id, status: 'in-progress' })}
          >
            <Play className="w-4 h-4" />
            Start Workout
          </Button>
        )}
        {workout.status === 'in-progress' && (
          <Button
            loading={updateStatus.isPending}
            onClick={() => updateStatus.mutate({ id: workout.id, status: 'completed' })}
          >
            <CheckCircle className="w-4 h-4" />
            Mark Complete
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-orange-400" />
            Exercises ({exercises.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {exercises.length === 0 ? (
            <p className="text-slate-500 text-sm">No exercises logged.</p>
          ) : (
            <div className="flex flex-col divide-y divide-slate-700/50">
              {exercises.map((ex, i) => (
                <div key={i} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-white font-medium">{ex.name}</p>
                      {ex.notes && (
                        <p className="text-slate-500 text-xs mt-0.5">{ex.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-400 shrink-0">
                      <span>{ex.sets} sets</span>
                      <span>×</span>
                      <span>{ex.reps} reps</span>
                      {ex.rest && <span className="text-slate-500">{ex.rest}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {workout.notes && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 text-sm">{workout.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
