import { cn } from '@/utils/cn';

type BadgeVariant = 'planned' | 'in-progress' | 'completed' | 'active' | 'ended' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  planned: 'bg-slate-700/60 text-slate-300 border-slate-600/50',
  'in-progress': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  completed: 'bg-green-500/15 text-green-400 border-green-500/30',
  active: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  ended: 'bg-slate-700/60 text-slate-400 border-slate-600/50',
  default: 'bg-slate-700/60 text-slate-300 border-slate-600/50',
};

export default function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
