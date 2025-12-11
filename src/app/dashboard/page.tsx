import { getAllUrls } from "@/app/actions/url";
import UrlTable from "@/components/UrlTable";
import Link from "next/link";

export const metadata = {
  title: "Dashboard - Linkly",
  description: "Manage your shortened URLs",
};

// Revalidate every 30 seconds for near real-time updates
export const revalidate = 30;

export default async function DashboardPage() {
  const result = await getAllUrls();

  const urls = result.success && result.data ? result.data : [];

  // Calculate stats
  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
  const totalUrls = urls.length;
  const avgClicks = totalUrls > 0 ? Math.round(totalClicks / totalUrls) : 0;

  return (
    <>
      {/* Background effects */}
      <div className="gradient-bg" />
      <div className="grid-pattern" />

      <main className="min-h-screen px-4 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
              <p className="text-gray-400">
                Manage and track your shortened URLs
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-cyan-500 to-violet-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New URL
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {/* Total URLs */}
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-cyan-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total URLs</p>
                  <p className="text-2xl font-bold text-white">
                    {totalUrls.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Clicks */}
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-violet-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Clicks</p>
                  <p className="text-2xl font-bold text-white">
                    {totalClicks.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Average Clicks */}
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Avg. Clicks</p>
                  <p className="text-2xl font-bold text-white">
                    {avgClicks.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* URL Table */}
          <UrlTable initialUrls={urls} />
        </div>
      </main>
    </>
  );
}
