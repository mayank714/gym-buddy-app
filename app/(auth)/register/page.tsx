'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().optional(),
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

export default function RegisterPage() {
  const { register: registerUser, loading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormValues) => {
    registerUser({
      name: data.name,
      email: data.email,
      phone: data.phone,
      age: data.age ? Number(data.age) : undefined,
      fitness_level: data.fitness_level,
      goals: data.goals,
      injuries: data.injuries,
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
      <p className="text-slate-400 text-sm mb-8">
        Set up your profile to get personalized workouts.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Full name"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Phone (optional)"
            placeholder="555-1234"
            {...register('phone')}
          />
          <Input
            label="Age (optional)"
            type="number"
            placeholder="28"
            error={errors.age?.message}
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

        <Input
          label="Goals (optional)"
          placeholder="e.g. muscle gain, weight loss"
          {...register('goals')}
        />
        <Input
          label="Injuries / limitations (optional)"
          placeholder="e.g. lower back pain, knee issues"
          {...register('injuries')}
        />

        <Button type="submit" loading={loading} size="lg" className="w-full mt-1">
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-slate-400 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-orange-400 hover:text-orange-300 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
