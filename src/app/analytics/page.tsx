import { getAnalytics } from "@/app/actions/analytics";
import AnalyticsClient from "./components/AnalyticsClient";
import Link from "next/link";

export const metadata = {
  title: "Analytics - Linkly",
  description: "View detailed analytics for your shortened URLs",
};

export const revalidate = 30;

export default async function AnalyticsPage() {
  const result = await getAnalytics();

  if (!result.success || !result.data) {
    return (
      <>
        <div className="gradient-bg" />
        <div className="grid-pattern" />
        
        <main className="min-h-screen px-4 py-8 md:py-12">
          <div className="max-w-7xl mx-auto">
            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Failed to Load Analytics</h2>
              <p className="text-gray-400">{result.error || "Please try again later."}</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <div className="gradient-bg" />
      <div className="grid-pattern" />
      
      <main className="min-h-screen px-4 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Analytics</h1>
              <p className="text-gray-400">Track your URL performance and click data</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-medium hover:bg-white/10 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Dashboard
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-cyan-500 to-violet-500 text-white font-medium hover:opacity-90 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New URL
              </Link>
            </div>
          </div>

          {/* Analytics Content */}
          <AnalyticsClient data={result.data} />
        </div>
      </main>
    </>
  );
}

