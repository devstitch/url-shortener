import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <div className="gradient-bg" />
      <div className="grid-pattern" />
      
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center">
          {/* 404 Icon */}
          <div className="w-20 h-20 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>

          <h1 className="text-6xl font-bold text-white mb-2">404</h1>
          <h2 className="text-xl font-semibold text-gray-300 mb-2">Link Not Found</h2>
          <p className="text-gray-400 mb-6">
            The short URL you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>

          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full py-3 px-4 rounded-xl bg-linear-to-r from-cyan-500 to-violet-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Create New Short URL
            </Link>
            <Link
              href="/dashboard"
              className="block w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-medium hover:bg-white/10 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

