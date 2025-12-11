import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { recordClickAndGetUrl } from "@/app/actions/analytics";
import Link from "next/link";

interface Props {
  params: Promise<{ shortCode: string }>;
}

export default async function RedirectPage({ params }: Props) {
  const { shortCode } = await params;

  // Get request headers for analytics
  const headersList = await headers();
  const referrer = headersList.get("referer") || undefined;
  const userAgent = headersList.get("user-agent") || undefined;

  // Record click and get original URL
  const result = await recordClickAndGetUrl(shortCode, {
    referrer,
    userAgent,
  });

  // Handle successful redirect
  if (result.success && result.originalUrl) {
    redirect(result.originalUrl);
  }

  // Handle not found
  if (result.notFound) {
    notFound();
  }

  // Handle expired link
  if (result.expired) {
    return (
      <>
        <div className="gradient-bg" />
        <div className="grid-pattern" />
        
        <main className="min-h-screen flex flex-col items-center justify-center px-4">
          <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center">
            {/* Expired Icon */}
            <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">Link Expired</h1>
            <p className="text-gray-400 mb-6">
              This shortened URL has expired and is no longer available.
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

  // Handle other errors
  return (
    <>
      <div className="gradient-bg" />
      <div className="grid-pattern" />
      
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center">
          {/* Error Icon */}
          <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Something Went Wrong</h1>
          <p className="text-gray-400 mb-6">
            {result.error || "Unable to process this link. Please try again."}
          </p>

          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full py-3 px-4 rounded-xl bg-linear-to-r from-cyan-500 to-violet-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Go Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

