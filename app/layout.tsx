import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import QueryProvider from '@/components/providers/QueryProvider';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });

export const metadata: Metadata = {
  title: { default: 'Gym Buddy', template: '%s | Gym Buddy' },
  description: 'AI-powered personal gym trainer — voice & chat coaching, workout tracking, and personalized plans.',
  keywords: ['gym', 'fitness', 'AI trainer', 'workout', 'personal trainer'],
  openGraph: {
    title: 'Gym Buddy',
    description: 'Your AI-powered gym trainer',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        <QueryProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid #334155',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
