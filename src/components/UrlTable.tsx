"use client";

import { useState, useMemo, useCallback, useTransition } from "react";
import { toast } from "sonner";
import { deleteUrl } from "@/app/actions/url";
import ConfirmDialog from "@/components/ConfirmDialog";
import QRCodeModal from "@/components/QRCodeModal";
import ShareButtons from "@/components/ShareButtons";

interface UrlData {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: Date;
  expiresAt: Date | null;
  userId: string | null;
}

interface UrlTableProps {
  initialUrls: UrlData[];
}

type SortField = "createdAt" | "clicks" | "shortCode";
type SortOrder = "asc" | "desc";

export default function UrlTable({ initialUrls }: UrlTableProps) {
  const [urls, setUrls] = useState<UrlData[]>(initialUrls);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UrlData | null>(null);
  const [qrTarget, setQrTarget] = useState<UrlData | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Filter and sort URLs
  const filteredAndSortedUrls = useMemo(() => {
    let filtered = urls;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = urls.filter(
        (url) =>
          url.originalUrl.toLowerCase().includes(query) ||
          url.shortCode.toLowerCase().includes(query)
      );
    }

    return [...filtered].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "createdAt":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "clicks":
          comparison = a.clicks - b.clicks;
          break;
        case "shortCode":
          comparison = a.shortCode.localeCompare(b.shortCode);
          break;
      }
      return sortOrder === "desc" ? -comparison : comparison;
    });
  }, [urls, searchQuery, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const copyToClipboard = useCallback(async (shortUrl: string, id: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(id);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  }, []);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;

    startTransition(async () => {
      const result = await deleteUrl(deleteTarget.id);
      if (result.success) {
        setUrls((prev) => prev.filter((url) => url.id !== deleteTarget.id));
        toast.success("URL deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete URL");
      }
      setDeleteTarget(null);
    });
  }, [deleteTarget]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const truncateUrl = (url: string, maxLength: number = 40) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <svg
          className="w-4 h-4 opacity-30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }
    return sortOrder === "desc" ? (
      <svg
        className="w-4 h-4 text-cyan-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4 text-cyan-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    );
  };

  // Empty state
  if (urls.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gray-800/50 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No URLs yet</h3>
        <p className="text-gray-400 mb-6">
          Start shortening URLs to see them here
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-violet-500 text-white font-medium hover:opacity-90 transition-opacity"
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
          Create your first short URL
        </a>
      </div>
    );
  }

  return (
    <>
      {/* Modals */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete URL"
        message={`Are you sure you want to delete "${deleteTarget?.shortCode}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isPending}
      />

      <QRCodeModal
        isOpen={!!qrTarget}
        onClose={() => setQrTarget(null)}
        url={qrTarget?.shortUrl || ""}
        shortCode={qrTarget?.shortCode || ""}
      />

      {/* Search and Filter Bar */}
      <div className="glass-card rounded-xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search URLs..."
              className="glow-input w-full pl-10 pr-4 py-3 rounded-lg text-white placeholder-gray-500 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="glow-input px-4 py-3 rounded-lg text-white text-sm bg-gray-800/60 border border-white/10 cursor-pointer"
            >
              <option value="createdAt">Sort by Date</option>
              <option value="clicks">Sort by Clicks</option>
              <option value="shortCode">Sort by Code</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="glow-input px-4 py-3 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              {sortOrder === "desc" ? (
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
                    d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                  />
                </svg>
              ) : (
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
                    d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-500">
          Showing {filteredAndSortedUrls.length} of {urls.length} URLs
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block glass-card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                Original URL
              </th>
              <th
                className="text-left px-6 py-4 text-sm font-medium text-gray-400 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort("shortCode")}
              >
                <div className="flex items-center gap-2">
                  Short URL
                  <SortIcon field="shortCode" />
                </div>
              </th>
              <th
                className="text-left px-6 py-4 text-sm font-medium text-gray-400 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort("clicks")}
              >
                <div className="flex items-center gap-2">
                  Clicks
                  <SortIcon field="clicks" />
                </div>
              </th>
              <th
                className="text-left px-6 py-4 text-sm font-medium text-gray-400 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center gap-2">
                  Created
                  <SortIcon field="createdAt" />
                </div>
              </th>
              <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedUrls.map((url) => (
              <tr
                key={url.id}
                className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors"
              >
                <td className="px-6 py-4">
                  <a
                    href={url.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-cyan-400 transition-colors font-mono text-sm"
                    title={url.originalUrl}
                  >
                    {truncateUrl(url.originalUrl, 50)}
                  </a>
                </td>
                <td className="px-6 py-4">
                  <code className="text-cyan-400 font-mono text-sm bg-cyan-500/10 px-2 py-1 rounded">
                    {url.shortCode}
                  </code>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-violet-400"
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
                    <span className="text-white font-medium">
                      {url.clicks.toLocaleString()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-400 text-sm">
                    {formatDate(url.createdAt)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {/* QR Code */}
                    <button
                      onClick={() => setQrTarget(url)}
                      className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20 transition-colors"
                      title="Generate QR Code"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                        />
                      </svg>
                    </button>
                    {/* Copy */}
                    <button
                      onClick={() => copyToClipboard(url.shortUrl, url.id)}
                      className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                      title="Copy short URL"
                    >
                      {copiedId === url.id ? (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                      )}
                    </button>
                    {/* Delete */}
                    <button
                      onClick={() => setDeleteTarget(url)}
                      className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Delete URL"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredAndSortedUrls.map((url) => (
          <div key={url.id} className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <code className="text-cyan-400 font-mono text-lg bg-cyan-500/10 px-3 py-1 rounded-lg">
                {url.shortCode}
              </code>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQrTarget(url)}
                  className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => copyToClipboard(url.shortUrl, url.id)}
                  className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
                >
                  {copiedId === url.id ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => setDeleteTarget(url)}
                  className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <a
              href={url.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gray-400 text-sm font-mono truncate hover:text-cyan-400 transition-colors mb-3"
            >
              {url.originalUrl}
            </a>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-violet-400">
                  <svg
                    className="w-4 h-4"
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
                  <span className="font-medium">
                    {url.clicks.toLocaleString()}
                  </span>
                </div>
                <span className="text-gray-500">
                  {formatDate(url.createdAt)}
                </span>
              </div>
              <button
                onClick={() =>
                  setExpandedId(expandedId === url.id ? null : url.id)
                }
                className="text-gray-500 hover:text-white transition-colors"
              >
                <svg
                  className={`w-5 h-5 transition-transform ${
                    expandedId === url.id ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            {/* Expanded Share Section */}
            {expandedId === url.id && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs text-gray-500 mb-2">Share this link</p>
                <ShareButtons url={url.shortUrl} />
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredAndSortedUrls.length === 0 && urls.length > 0 && (
        <div className="glass-card rounded-xl p-8 text-center">
          <svg
            className="w-12 h-12 text-gray-600 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-white mb-1">
            No results found
          </h3>
          <p className="text-gray-400 text-sm">
            Try adjusting your search query
          </p>
        </div>
      )}
    </>
  );
}
