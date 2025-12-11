import { NextRequest, NextResponse } from "next/server";
import { cleanupExpiredUrls } from "@/app/actions/analytics";

// Secret key for cron job authentication (set in environment)
const CRON_SECRET = process.env.CRON_SECRET;

/**
 * API route for cleaning up expired URLs
 * Can be called by a cron job service (e.g., Vercel Cron, GitHub Actions)
 *
 * Usage:
 * GET /api/cleanup?secret=YOUR_CRON_SECRET
 *
 * Or with Authorization header:
 * GET /api/cleanup
 * Authorization: Bearer YOUR_CRON_SECRET
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { searchParams } = new URL(request.url);
    const secretParam = searchParams.get("secret");
    const authHeader = request.headers.get("authorization");
    const bearerToken = authHeader?.replace("Bearer ", "");

    const providedSecret = secretParam || bearerToken;

    // If CRON_SECRET is set, require authentication
    if (CRON_SECRET && providedSecret !== CRON_SECRET) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Run cleanup
    const result = await cleanupExpiredUrls();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Cleanup completed. Deleted ${result.deletedCount} expired URLs.`,
        deletedCount: result.deletedCount,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Cleanup API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

// Also support POST for flexibility
export async function POST(request: NextRequest) {
  return GET(request);
}
