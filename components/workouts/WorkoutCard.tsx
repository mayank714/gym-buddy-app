'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dumbbell, Clock, Trash2, ChevronRight, Play, CheckCircle } from 'lucide-react';
import { Workout, WorkoutStatus } from '@/types/workout.types';
import { Card } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatDate, formatDuration, parseExercises } from '@/utils/helpers';
import { useUpdateWorkoutStatus, useDeleteWorkout } from '@/hooks/useWorkouts';

interface WorkoutCardProps {
  workout: Workout;
}

const statusLabel: Record<WorkoutStatus, string> = {
  planned: 'Planned',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  const router = useRouter();
  const exercises = parseExercises(workout.exercises);
  const updateStatus = useUpdateWorkoutStatus();
  const deleteWorkout = useDeleteWorkout();
  const [confirming, setConfirming] = useState(false);

  const handleStatus = (status: WorkoutStatus) => {
    updateStatus.mutate({ id: workout.id, status });
  };

  const handleDelete = () => {
    if (!confirming) { setConfirming(true); return; }
    deleteWorkout.mutate(workout.id);
  };

  return (
    <Card hover className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-semibold text-white truncate">{workout.name}</h3>
            <Badge variant={workout.status as WorkoutStatus}>{statusLabel[workout.status]}</Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>{formatDate(workout.date)}</span>
            {workout.duration && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(workout.duration)}
                </span>
              </>
            )}
            {workout.difficulty && (
              <>
                <span>·</span>
                <span className="capitalize">{workout.difficulty}</span>
              </>
            )}
          </div>
        </div>
        <button
          onClick={handleDelete}
          className={`p-1.5 rounded-lg transition-colors shrink-0 ${
            confirming
              ? 'text-red-400 bg-red-400/10'
              : 'text-slate-500 hover:text-red-400 hover:bg-red-400/10'
          }`}
          title={confirming ? 'Click again to confirm' : 'Delete workout'}
          onBlur={() => setConfirming(false)}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {exercises.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {exercises.slice(0, 3).map((ex, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
              <Dumbbell className="w-3.5 h-3.5 shrink-0 text-orange-500/70" />
              <span className="truncate">{ex.name}</span>
              <span className="ml-auto text-xs text-slate-500 shrink-0">
                {ex.sets}×{ex.reps}
              </span>
            </div>
          ))}
          {exercises.length > 3 && (
            <p className="text-xs text-slate-500 pl-5">+{exercises.length - 3} more</p>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 pt-1 border-t border-slate-700/50">
        {workout.status === 'planned' && (
          <Button
            size="sm"
            variant="secondary"
            className="flex-1"
            loading={updateStatus.isPending}
            onClick={() => handleStatus('in-progress')}
          >
            <Play className="w-3 h-3" />
            Start
          </Button>
        )}
        {workout.status === 'in-progress' && (
          <Button
            size="sm"
            variant="primary"
            className="flex-1"
            loading={updateStatus.isPending}
            onClick={() => handleStatus('completed')}
          >
            <CheckCircle className="w-3 h-3" />
            Complete
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          className="flex-1"
          onClick={() => router.push(`/dashboard/workouts/${workout.id}`)}
        >
          Details
          <ChevronRight className="w-3 h-3" />
        </Button>
      </div>
    </Card>
  );
}
