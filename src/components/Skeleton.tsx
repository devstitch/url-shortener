"use client";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className = "", style }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-800/50 rounded ${className}`}
      style={style}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-20 rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
      <Skeleton className="h-4 w-full rounded" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-20 rounded" />
        <Skeleton className="h-4 w-24 rounded" />
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 flex gap-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16 ml-auto" />
      </div>

      {/* Rows */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="border-b border-white/5 last:border-0 px-6 py-4 flex items-center gap-4"
        >
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-28" />
          <div className="flex gap-2 ml-auto">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="glass-card rounded-xl p-6">
      <Skeleton className="h-5 w-40 mb-4" />
      <div className="h-64 flex items-end justify-between gap-2 px-4">
        {[...Array(7)].map((_, i) => (
          <Skeleton
            key={i}
            className="w-full rounded-t"
            style={{ height: `${Math.random() * 60 + 20}%` }}
          />
        ))}
      </div>
    </div>
  );
}
