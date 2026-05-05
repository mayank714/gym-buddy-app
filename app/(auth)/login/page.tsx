'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { login, loading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
      <p className="text-slate-400 text-sm mb-8">
        Enter your email to access your account.
      </p>

      <form onSubmit={handleSubmit(({ email }) => login(email))} className="flex flex-col gap-5">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Button type="submit" loading={loading} size="lg" className="w-full">
          Continue with Email
        </Button>
      </form>

      <p className="text-center text-sm text-slate-400 mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-orange-400 hover:text-orange-300 font-medium">
          Create one
        </Link>
      </p>
    </div>
  );
}
