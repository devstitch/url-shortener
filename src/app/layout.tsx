import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import Navbar from "@/components/Navbar";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Linkly - URL Shortener",
  description:
    "Transform long URLs into short, memorable links. Track clicks and share effortlessly.",
  keywords: ["url shortener", "link shortener", "short links", "url tracker"],
  authors: [{ name: "Linkly" }],
  openGraph: {
    title: "Linkly - URL Shortener",
    description: "Transform long URLs into short, memorable links.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} antialiased`}
        style={{ fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}
      >
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(17, 24, 39, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#f9fafb",
              backdropFilter: "blur(20px)",
            },
            className: "sonner-toast",
          }}
          theme="dark"
        />
        <Navbar />
        <div className="pt-20">{children}</div>
      </body>
    </html>
  );
}
