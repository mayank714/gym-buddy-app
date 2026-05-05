import { Zap } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 flex">
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950/30 p-12 border-r border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Gym Buddy</span>
        </div>
        <div>
          <blockquote className="text-2xl font-semibold text-white leading-snug mb-4">
            "Your AI-powered personal trainer, available 24/7."
          </blockquote>
          <p className="text-slate-400">
            Get personalized workouts, real-time coaching, and motivation — via voice or chat.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Workouts', value: 'Personalized' },
            { label: 'Coaching', value: 'Real-time' },
            { label: 'Support', value: '24/7' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
              <p className="text-orange-400 font-bold text-lg">{value}</p>
              <p className="text-slate-400 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Gym Buddy</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
