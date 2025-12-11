"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createShortUrl } from "@/app/actions/url";
import QRCodeModal from "@/components/QRCodeModal";
import ShareButtons from "@/components/ShareButtons";

interface ShortenedUrl {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState<ShortenedUrl | null>(null);
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    // Validate custom code if provided
    if (customCode && (customCode.length < 4 || customCode.length > 8)) {
      toast.error("Custom code must be 4-8 characters");
      return;
    }

    if (customCode && !/^[a-zA-Z0-9]+$/.test(customCode)) {
      toast.error("Custom code must be alphanumeric");
      return;
    }

    startTransition(async () => {
      const response = await createShortUrl(url);

      if (response.success && response.data) {
        setResult({
          shortCode: response.data.shortCode,
          shortUrl: response.data.shortUrl,
          originalUrl: response.data.originalUrl,
        });
        toast.success("URL shortened successfully!");
        setUrl("");
        setCustomCode("");
      } else {
        toast.error(response.error || "Failed to shorten URL");
      }
    });
  };

  const copyToClipboard = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <>
      {/* Background effects */}
      <div className="gradient-bg" />
      <div className="grid-pattern" />

      {/* QR Code Modal */}
      {result && (
        <QRCodeModal
          isOpen={showQR}
          onClose={() => setShowQR(false)}
          url={result.shortUrl}
          shortCode={result.shortCode}
        />
      )}

      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
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
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            Fast & Secure URL Shortener
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            <span className="text-white">Shorten your </span>
            <span className="bg-linear-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              links
            </span>
          </h1>

          <p className="text-gray-400 text-lg max-w-md mx-auto">
            Transform long URLs into short, memorable links. Track clicks and
            share effortlessly.
          </p>
        </div>

        {/* Main Card */}
        <div className="w-full max-w-2xl glass-card rounded-2xl p-8 animate-fade-in stagger-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* URL Input */}
            <div className="space-y-2">
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-300"
              >
                Enter your long URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
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
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/your-very-long-url-here"
                  className="glow-input w-full pl-12 pr-4 py-4 rounded-xl text-white placeholder-gray-500 text-base"
                  disabled={isPending}
                />
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className={`w-4 h-4 transition-transform ${
                  showAdvanced ? "rotate-90" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              Advanced options
            </button>

            {/* Advanced Options */}
            {showAdvanced && (
              <div className="space-y-4 p-4 rounded-xl bg-white/2 border border-white/5">
                {/* Custom Short Code */}
                <div className="space-y-2">
                  <label
                    htmlFor="customCode"
                    className="block text-sm font-medium text-gray-400"
                  >
                    Custom short code (optional)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 text-sm">
                      {process.env.NEXT_PUBLIC_BASE_URL ||
                        "http://localhost:3000"}
                      /
                    </span>
                    <input
                      type="text"
                      id="customCode"
                      value={customCode}
                      onChange={(e) =>
                        setCustomCode(
                          e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "")
                        )
                      }
                      placeholder="mylink"
                      className="glow-input w-full pl-[200px] pr-4 py-3 rounded-lg text-white placeholder-gray-600 text-sm font-mono"
                      disabled={isPending}
                      maxLength={8}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    4-8 alphanumeric characters. Leave empty for auto-generated
                    code.
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="btn-gradient w-full py-4 rounded-xl text-white font-semibold text-base flex items-center justify-center gap-3 mt-6"
            >
              {isPending ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Shortening...</span>
                </>
              ) : (
                <>
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span>Shorten URL</span>
                </>
              )}
            </button>
          </form>

          {/* Result Section */}
          {result && (
            <div className="mt-8 result-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-cyan-400"
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
                  <span className="text-cyan-400 font-medium">
                    Your shortened URL is ready!
                  </span>
                </div>
              </div>

              {/* Short URL Display */}
              <div className="url-display flex items-center justify-between p-4 gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-1">Short URL</p>
                  <p className="text-cyan-400 font-mono text-lg truncate">
                    {result.shortUrl}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {/* QR Code Button */}
                  <button
                    onClick={() => setShowQR(true)}
                    className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20 transition-colors"
                    title="Generate QR Code"
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
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                  </button>
                  {/* Copy Button */}
                  <button
                    onClick={copyToClipboard}
                    className="copy-btn px-4 py-2 rounded-lg text-cyan-400 font-medium flex items-center gap-2"
                  >
                    {copied ? (
                      <>
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
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
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
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Share this link</p>
                <ShareButtons
                  url={result.shortUrl}
                  title={`Check out this link: ${result.shortUrl}`}
                />
              </div>

              {/* Original URL */}
              <div className="pt-4 border-t border-white/5">
                <p className="text-xs text-gray-500 mb-1">Original URL</p>
                <p className="text-gray-400 text-sm truncate font-mono">
                  {result.originalUrl}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full animate-fade-in stagger-3">
          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-500 text-sm">
              Generate short links in milliseconds
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Click Tracking</h3>
            <p className="text-gray-500 text-sm">
              Monitor link performance easily
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Secure & Reliable</h3>
            <p className="text-gray-500 text-sm">Your links are safe with us</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-600 text-sm animate-fade-in stagger-4">
          <p>Built with Next.js, Prisma & Supabase</p>
        </footer>
      </main>
    </>
  );
}
