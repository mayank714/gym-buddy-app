'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import { useCurrentUser, useUpdateUser } from '@/hooks/useUser';
import { getFitnessLevelLabel } from '@/utils/helpers';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z
    .string()
    .optional()
    .refine(
      (v) => !v || (Number(v) >= 13 && Number(v) <= 100),
      'Age must be between 13 and 100'
    ),
  fitness_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  goals: z.string().optional(),
  injuries: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function ProfilePage() {
  const { data: user, isLoading } = useCurrentUser();
  const updateUser = useUpdateUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      name: user?.name || '',
      age: user?.age ? String(user.age) : '',
      fitness_level: (user?.fitness_level as FormValues['fitness_level']) || undefined,
      goals: user?.goals || '',
      injuries: user?.injuries || '',
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
          <User className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
          <p className="text-slate-400 text-sm">{user?.email}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Fitness Level', value: getFitnessLevelLabel(user?.fitness_level) },
          { label: 'Goals', value: user?.goals || 'Not set' },
          { label: 'Injuries', value: user?.injuries || 'None' },
        ].map(({ label, value }) => (
          <Card key={label} className="text-center">
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className="text-sm text-white font-medium capitalize">{value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((data) =>
              updateUser.mutate({
                name: data.name,
                age: data.age ? Number(data.age) : undefined,
                fitness_level: data.fitness_level,
                goals: data.goals,
                injuries: data.injuries,
              })
            )}
            className="flex flex-col gap-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Full name"
                error={errors.name?.message}
                {...register('name')}
              />
              <Input
                label="Age"
                type="number"
                {...register('age')}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Fitness level</label>
              <select
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                {...register('fitness_level')}
              >
                <option value="">Select level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <Input label="Goals" placeholder="e.g. muscle gain, weight loss" {...register('goals')} />
            <Input label="Injuries / limitations" placeholder="e.g. lower back pain" {...register('injuries')} />

            <Button
              type="submit"
              loading={updateUser.isPending}
              disabled={!isDirty}
              className="w-full"
            >
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {user?.vapiAssistantId && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>VAPI Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Assistant ID</span>
                <span className="text-slate-300 font-mono text-xs">{user.vapiAssistantId}</span>
              </div>
              {user.vapiPhoneNumber && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone number</span>
                  <span className="text-slate-300">{user.vapiPhoneNumber}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
