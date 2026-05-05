'use client';

import { useState } from 'react';
import { Plus, Dumbbell } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import WorkoutCard from '@/components/workouts/WorkoutCard';
import WorkoutForm from '@/components/workouts/WorkoutForm';
import { useWorkouts } from '@/hooks/useWorkouts';

type Filter = 'all' | 'planned' | 'in-progress' | 'completed';

export default function WorkoutsPage() {
  const { data: workouts, isLoading } = useWorkouts();
  const [filter, setFilter] = useState<Filter>('all');
  const [showModal, setShowModal] = useState(false);

  const filtered = workouts?.filter((w) =>
    filter === 'all' ? true : w.status === filter
  );

  const filters: { label: string; value: Filter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Planned', value: 'planned' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Workouts</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {workouts?.length ?? 0} total workouts
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />
          New Workout
        </Button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === value
                ? 'bg-orange-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : filtered && filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-20 text-center">
          <Dumbbell className="w-10 h-10 text-slate-700 mb-4" />
          <p className="text-slate-300 font-medium">No workouts yet</p>
          <p className="text-slate-500 text-sm mb-4">
            {filter !== 'all'
              ? `No ${filter} workouts found.`
              : 'Create your first workout to get started.'}
          </p>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" />
            Create Workout
          </Button>
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="New Workout"
        size="lg"
      >
        <WorkoutForm onSuccess={() => setShowModal(false)} />
      </Modal>
    </div>
  );
}
