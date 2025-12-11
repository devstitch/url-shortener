"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsStats {
  totalUrls: number;
  totalClicks: number;
  avgClicks: number;
  clicksToday: number;
  clicksThisWeek: number;
  clicksThisMonth: number;
}

interface PopularUrl {
  id: string;
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  clicks: number;
  createdAt: Date;
}

interface RecentClick {
  id: string;
  timestamp: Date;
  referrer: string | null;
  shortCode: string;
  originalUrl: string;
}

interface ClickTimelineData {
  date: string;
  clicks: number;
}

interface AnalyticsClientProps {
  data: {
    stats: AnalyticsStats;
    popularUrls: PopularUrl[];
    recentClicks: RecentClick[];
    clickTimeline: ClickTimelineData[];
  };
}

export default function AnalyticsClient({ data }: AnalyticsClientProps) {
  const { stats, popularUrls, recentClicks, clickTimeline } = data;

  const truncateUrl = (url: string, maxLength: number = 35) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total URLs */}
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total URLs</p>
              <p className="text-xl font-bold text-white">{stats.totalUrls.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Total Clicks */}
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Clicks</p>
              <p className="text-xl font-bold text-white">{stats.totalClicks.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Avg Clicks */}
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Avg/URL</p>
              <p className="text-xl font-bold text-white">{stats.avgClicks.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Today */}
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Today</p>
              <p className="text-xl font-bold text-white">{stats.clicksToday.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* This Week */}
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">This Week</p>
              <p className="text-xl font-bold text-white">{stats.clicksThisWeek.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* This Month */}
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">This Month</p>
              <p className="text-xl font-bold text-white">{stats.clicksThisMonth.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Click Timeline Chart */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Click Timeline (Last 7 Days)</h3>
          <div className="h-64">
            {clickTimeline.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={clickTimeline}>
                  <defs>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(17, 24, 39, 0.9)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
                    }}
                    labelStyle={{ color: "#9ca3af" }}
                    itemStyle={{ color: "#06b6d4" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorClicks)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No click data available yet
              </div>
            )}
          </div>
        </div>

        {/* Popular URLs */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Most Popular Links</h3>
          {popularUrls.length > 0 ? (
            <div className="space-y-3">
              {popularUrls.map((url, index) => (
                <div
                  key={url.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-linear-to-r from-cyan-500/20 to-violet-500/20 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-cyan-400">#{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <code className="text-cyan-400 font-mono text-sm">{url.shortCode}</code>
                    <p className="text-gray-500 text-xs truncate">{truncateUrl(url.originalUrl)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{url.clicks.toLocaleString()}</p>
                    <p className="text-gray-500 text-xs">clicks</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-500">
              No URLs created yet
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        {recentClicks.length > 0 ? (
          <div className="space-y-2">
            {recentClicks.map((click) => (
              <div
                key={click.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <code className="text-cyan-400 font-mono text-sm">{click.shortCode}</code>
                    <span className="text-gray-600">→</span>
                    <span className="text-gray-400 text-sm truncate">{truncateUrl(click.originalUrl, 40)}</span>
                  </div>
                  {click.referrer && (
                    <p className="text-gray-600 text-xs mt-0.5">
                      from: {truncateUrl(click.referrer, 50)}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-gray-400 text-sm">{formatTimeAgo(click.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-gray-500">
            No clicks recorded yet
          </div>
        )}
      </div>
    </div>
  );
}

