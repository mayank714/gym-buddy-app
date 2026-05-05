'use client';

import { useRouter } from 'next/navigation';
import {
  Dumbbell, MessageCircle, CheckCircle2, Calendar,
  TrendingUp, Zap, Phone
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { getSession } from '@/utils/auth';
import { useWorkouts, useTodaysWorkout } from '@/hooks/useWorkouts';
import { useChatHistory } from '@/hooks/useChat';
import { useCreateConversation } from '@/hooks/useChat';
import { formatDate, parseExercises } from '@/utils/helpers';
import { vapiService } from '@/services/vapi.service';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function DashboardPage() {
  const session = getSession();
  const router = useRouter();
  const { data: workouts, isLoading: loadingWorkouts } = useWorkouts();
  const { data: todayWorkout } = useTodaysWorkout();
  const { data: chatHistory } = useChatHistory();
  const createConversation = useCreateConversation();
  const [callingVapi, setCallingVapi] = useState(false);

  const completed = workouts?.filter((w) => w.status === 'completed').length ?? 0;
  const planned = workouts?.filter((w) => w.status === 'planned').length ?? 0;
  const activeConversations = chatHistory?.filter((c) => c.status === 'active').length ?? 0;

  const handleNewChat = () => {
    createConversation.mutate(undefined, {
      onSuccess: (conv) => router.push(`/dashboard/chat/${conv.id}`),
    });
  };

  const handleVoiceCall = async () => {
    if (!session) return;
    setCallingVapi(true);
    try {
      await vapiService.startCall(session.id);
      toast.success('Voice call initiated! Check your phone.');
    } catch {
      toast.error('Failed to start voice call. Make sure VAPI is configured.');
    } finally {
      setCallingVapi(false);
    }
  };

  const stats = [
    { label: 'Total Workouts', value: workouts?.length ?? 0, icon: Dumbbell, color: 'text-orange-400' },
    { label: 'Completed', value: completed, icon: CheckCircle2, color: 'text-green-400' },
    { label: 'Planned', value: planned, icon: Calendar, color: 'text-blue-400' },
    { label: 'Chat Sessions', value: chatHistory?.length ?? 0, icon: MessageCircle, color: 'text-purple-400' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Hey {session?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Ready to crush today&apos;s workout?
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="text-center">
            <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-400" />
              Today&apos;s Workout
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingWorkouts ? (
              <div className="flex justify-center py-4"><Spinner size="sm" /></div>
            ) : todayWorkout ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-white font-medium">{todayWorkout.name}</p>
                  <Badge variant={todayWorkout.status as 'planned' | 'in-progress' | 'completed'}>
                    {todayWorkout.status}
                  </Badge>
                </div>
                <p className="text-slate-500 text-sm mb-3">
                  {parseExercises(todayWorkout.exercises).length} exercises
                  {todayWorkout.difficulty && ` · ${todayWorkout.difficulty}`}
                </p>
                <Button
                  size="sm"
                  onClick={() => router.push(`/dashboard/workouts/${todayWorkout.id}`)}
                >
                  View workout
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-slate-400 text-sm mb-3">No workout scheduled for today.</p>
                <Button size="sm" onClick={() => router.push('/dashboard/workouts')}>
                  Plan a workout
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Button
                className="w-full justify-start gap-3"
                variant="secondary"
                onClick={handleNewChat}
                loading={createConversation.isPending}
              >
                <MessageCircle className="w-4 h-4" />
                Chat with Gym Buddy
              </Button>
              <Button
                className="w-full justify-start gap-3"
                variant="secondary"
                onClick={handleVoiceCall}
                loading={callingVapi}
              >
                <Phone className="w-4 h-4" />
                Start Voice Call
              </Button>
              <Button
                className="w-full justify-start gap-3"
                variant="secondary"
                onClick={() => router.push('/dashboard/workouts')}
              >
                <Dumbbell className="w-4 h-4" />
                Manage Workouts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {chatHistory && chatHistory.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-400" />
                Recent Sessions
                {activeConversations > 0 && (
                  <Badge variant="active">{activeConversations} active</Badge>
                )}
              </CardTitle>
              <Button size="sm" variant="ghost" onClick={() => router.push('/dashboard/chat')}>
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col divide-y divide-slate-700/50">
              {chatHistory.slice(0, 3).map((conv) => (
                <div
                  key={conv.id}
                  className="flex items-center justify-between py-3 cursor-pointer hover:bg-slate-700/20 px-2 rounded-lg transition-colors"
                  onClick={() => router.push(`/dashboard/chat/${conv.id}`)}
                >
                  <div>
                    <p className="text-sm text-white">Chat session</p>
                    <p className="text-xs text-slate-500">{formatDate(conv.startedAt)}</p>
                  </div>
                  <Badge variant={conv.status === 'active' ? 'active' : 'ended'}>{conv.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
