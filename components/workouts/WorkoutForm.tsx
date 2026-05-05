'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useCreateWorkout } from '@/hooks/useWorkouts';
import { getSession } from '@/utils/auth';

const exerciseSchema = z.object({
  name: z.string().min(1, 'Required'),
  sets: z
    .string()
    .refine((v) => !v || Number(v) >= 1, 'Min 1 set'),
  reps: z.string().min(1, 'Required'),
  rest: z.string().optional(),
  notes: z.string().optional(),
});

const schema = z.object({
  name: z.string().min(2, 'Workout name is required'),
  difficulty: z.enum(['easy', 'medium', 'hard', 'intermediate']).optional(),
  exercises: z.array(exerciseSchema).min(1, 'Add at least one exercise'),
});

type FormValues = z.infer<typeof schema>;

interface WorkoutFormProps {
  onSuccess?: () => void;
}

export default function WorkoutForm({ onSuccess }: WorkoutFormProps) {
  const session = getSession();
  const createWorkout = useCreateWorkout();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { exercises: [{ name: '', sets: '3', reps: '10', rest: '', notes: '' }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'exercises' });

  const onSubmit = (data: FormValues) => {
    if (!session) return;
    createWorkout.mutate(
      {
        userId: session.id,
        name: data.name,
        exercises: data.exercises.map((ex) => ({ ...ex, sets: Number(ex.sets) })),
        difficulty: data.difficulty,
      },
      { onSuccess }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Workout name"
          placeholder="e.g. Upper Body Push"
          error={errors.name?.message}
          {...register('name')}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-300">Difficulty</label>
          <select
            className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            {...register('difficulty')}
          >
            <option value="">Select</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="intermediate">Intermediate</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-slate-300">Exercises</p>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => append({ name: '', sets: '3', reps: '10', rest: '', notes: '' })}
          >
            <Plus className="w-3 h-3" />
            Add exercise
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          {fields.map((field, idx) => (
            <div
              key={field.id}
              className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/40 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Exercise {idx + 1}
                </span>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <Input
                placeholder="Exercise name"
                error={errors.exercises?.[idx]?.name?.message}
                {...register(`exercises.${idx}.name`)}
              />
              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="Sets"
                  type="number"
                  placeholder="3"
                  {...register(`exercises.${idx}.sets`)}
                />
                <Input
                  label="Reps"
                  placeholder="10"
                  {...register(`exercises.${idx}.reps`)}
                />
                <Input
                  label="Rest"
                  placeholder="90s"
                  {...register(`exercises.${idx}.rest`)}
                />
              </div>
            </div>
          ))}
        </div>
        {errors.exercises?.root && (
          <p className="text-xs text-red-400 mt-1">{errors.exercises.root.message}</p>
        )}
      </div>

      <Button type="submit" loading={createWorkout.isPending} className="w-full">
        Create Workout
      </Button>
    </form>
  );
}
