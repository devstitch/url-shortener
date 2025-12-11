"use server";

import prisma from "@/lib/prisma";
import { isExpired, getShortUrl } from "@/lib/utils/url";

// ============================================================================
// Types
// ============================================================================

export interface ClickData {
  referrer?: string;
  userAgent?: string;
}

export interface RedirectData {
  success: boolean;
  originalUrl?: string;
  error?: string;
  expired?: boolean;
  notFound?: boolean;
}

export interface AnalyticsStats {
  totalUrls: number;
  totalClicks: number;
  avgClicks: number;
  clicksToday: number;
  clicksThisWeek: number;
  clicksThisMonth: number;
}

export interface PopularUrl {
  id: string;
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  clicks: number;
  createdAt: Date;
}

export interface RecentClick {
  id: string;
  timestamp: Date;
  referrer: string | null;
  shortCode: string;
  originalUrl: string;
}

export interface ClickTimelineData {
  date: string;
  clicks: number;
}

export interface AnalyticsResult {
  success: boolean;
  data?: {
    stats: AnalyticsStats;
    popularUrls: PopularUrl[];
    recentClicks: RecentClick[];
    clickTimeline: ClickTimelineData[];
  };
  error?: string;
}

// ============================================================================
// Server Actions
// ============================================================================

/**
 * Records a click event and redirects
 */
export async function recordClickAndGetUrl(
  shortCode: string,
  clickData?: ClickData
): Promise<RedirectData> {
  try {
    if (!shortCode || shortCode.length < 4) {
      return {
        success: false,
        error: "Invalid short code",
        notFound: true,
      };
    }

    // Find the URL
    const url = await prisma.url.findUnique({
      where: { shortCode },
    });

    if (!url) {
      return {
        success: false,
        error: "URL not found",
        notFound: true,
      };
    }

    // Check if expired
    if (isExpired(url.expiresAt)) {
      return {
        success: false,
        error: "This link has expired",
        expired: true,
      };
    }

    // Increment click count
    await prisma.url.update({
      where: { shortCode },
      data: {
        clicks: { increment: 1 },
      },
    });

    // Record click event (wrapped in try-catch to not break redirect if this fails)
    try {
      await prisma.click.create({
        data: {
          urlId: url.id,
          referrer: clickData?.referrer || null,
          userAgent: clickData?.userAgent || null,
        },
      });
    } catch (clickError) {
      console.error("Failed to record click event:", clickError);
      // Don't fail the redirect if click recording fails
    }

    return {
      success: true,
      originalUrl: url.originalUrl,
    };
  } catch (error) {
    console.error("Error recording click:", error);
    return {
      success: false,
      error: "Failed to process redirect",
    };
  }
}

/**
 * Get comprehensive analytics data
 */
export async function getAnalytics(): Promise<AnalyticsResult> {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(todayStart);
    monthStart.setDate(monthStart.getDate() - 30);

    // Get URL stats
    const totalUrls = await prisma.url.count();
    const allUrls = await prisma.url.findMany({
      select: { clicks: true },
    });
    const totalClicks = allUrls.reduce((sum, url) => sum + url.clicks, 0);
    const avgClicks = totalUrls > 0 ? Math.round(totalClicks / totalUrls) : 0;

    // Get click counts - with fallback if Click table doesn't exist yet
    let clicksToday = 0;
    let clicksThisWeek = 0;
    let clicksThisMonth = 0;
    let recentClicks: RecentClick[] = [];
    let clickTimeline: ClickTimelineData[] = [];

    try {
      clicksToday = await prisma.click.count({
        where: { timestamp: { gte: todayStart } },
      });

      clicksThisWeek = await prisma.click.count({
        where: { timestamp: { gte: weekStart } },
      });

      clicksThisMonth = await prisma.click.count({
        where: { timestamp: { gte: monthStart } },
      });

      // Recent clicks
      const clicks = await prisma.click.findMany({
        orderBy: { timestamp: "desc" },
        take: 10,
        include: {
          url: {
            select: {
              shortCode: true,
              originalUrl: true,
            },
          },
        },
      });

      recentClicks = clicks.map((click) => ({
        id: click.id,
        timestamp: click.timestamp,
        referrer: click.referrer,
        shortCode: click.url.shortCode,
        originalUrl: click.url.originalUrl,
      }));

      // Click timeline
      clickTimeline = await getClickTimeline(7);
    } catch (clickError) {
      console.error("Error fetching click data:", clickError);
      // Continue with zeros if click data fails
    }

    // Popular URLs
    const popularUrls = await prisma.url.findMany({
      orderBy: { clicks: "desc" },
      take: 5,
    });

    return {
      success: true,
      data: {
        stats: {
          totalUrls,
          totalClicks,
          avgClicks,
          clicksToday,
          clicksThisWeek,
          clicksThisMonth,
        },
        popularUrls: popularUrls.map((url) => ({
          id: url.id,
          shortCode: url.shortCode,
          shortUrl: getShortUrl(url.shortCode),
          originalUrl: url.originalUrl,
          clicks: url.clicks,
          createdAt: url.createdAt,
        })),
        recentClicks,
        clickTimeline,
      },
    };
  } catch (error) {
    console.error("Error getting analytics:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get analytics",
    };
  }
}

/**
 * Get click timeline data for the last N days
 */
async function getClickTimeline(days: number): Promise<ClickTimelineData[]> {
  const timeline: ClickTimelineData[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    let clicks = 0;
    try {
      clicks = await prisma.click.count({
        where: {
          timestamp: {
            gte: dayStart,
            lt: dayEnd,
          },
        },
      });
    } catch {
      // If click table doesn't exist, just use 0
    }

    timeline.push({
      date: dayStart.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      clicks,
    });
  }

  return timeline;
}

/**
 * Get analytics for a specific URL
 */
export async function getUrlAnalytics(shortCode: string) {
  try {
    const url = await prisma.url.findUnique({
      where: { shortCode },
      include: {
        clickEvents: {
          orderBy: { timestamp: "desc" },
          take: 50,
        },
      },
    });

    if (!url) {
      return { success: false, error: "URL not found" };
    }

    // Get click timeline for this URL
    const now = new Date();
    const timeline: ClickTimelineData[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      let clicks = 0;
      try {
        clicks = await prisma.click.count({
          where: {
            urlId: url.id,
            timestamp: {
              gte: dayStart,
              lt: dayEnd,
            },
          },
        });
      } catch {
        // Continue with 0
      }

      timeline.push({
        date: dayStart.toLocaleDateString("en-US", { weekday: "short" }),
        clicks,
      });
    }

    return {
      success: true,
      data: {
        url: {
          id: url.id,
          shortCode: url.shortCode,
          shortUrl: getShortUrl(url.shortCode),
          originalUrl: url.originalUrl,
          clicks: url.clicks,
          createdAt: url.createdAt,
          expiresAt: url.expiresAt,
        },
        recentClicks: url.clickEvents.map((click) => ({
          id: click.id,
          timestamp: click.timestamp,
          referrer: click.referrer,
          userAgent: click.userAgent,
        })),
        timeline,
      },
    };
  } catch (error) {
    console.error("Error getting URL analytics:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get URL analytics",
    };
  }
}

/**
 * Cleanup expired URLs
 */
export async function cleanupExpiredUrls(): Promise<{ success: boolean; deletedCount?: number; error?: string }> {
  try {
    const result = await prisma.url.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return {
      success: true,
      deletedCount: result.count,
    };
  } catch (error) {
    console.error("Error cleaning up expired URLs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to cleanup expired URLs",
    };
  }
}
