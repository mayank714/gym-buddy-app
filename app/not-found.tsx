import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="text-center">
        <p className="text-6xl font-bold text-orange-500 mb-4">404</p>
        <h2 className="text-xl font-bold text-white mb-2">Page not found</h2>
        <p className="text-slate-400 text-sm mb-6">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center px-4 py-2 text-sm rounded-xl font-medium bg-orange-500 hover:bg-orange-600 text-white transition-all"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
