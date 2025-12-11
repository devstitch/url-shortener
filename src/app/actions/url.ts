"use server";

import prisma from "@/lib/prisma";
import {
  generateShortCode,
  validateUrl,
  isExpired,
  getShortUrl,
  normalizeUrl,
  createUrlSchema,
  deleteUrlSchema,
  type UrlResult,
  type UrlListResult,
  type DeleteResult,
  type RedirectResult,
} from "@/lib/utils/url";

// ============================================================================
// Server Actions
// ============================================================================

/**
 * Creates a new short URL
 * - Validates URL format
 * - Checks if URL already exists (returns existing if found)
 * - Generates unique 6-character shortCode
 * - Saves to Supabase via Prisma
 */
export async function createShortUrl(
  originalUrl: string,
  expiresAt?: Date,
  userId?: string
): Promise<UrlResult> {
  try {
    // Normalize and validate URL
    const normalizedUrl = normalizeUrl(originalUrl);
    const validation = validateUrl(normalizedUrl);

    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // Validate input with Zod
    const parseResult = createUrlSchema.safeParse({
      originalUrl: normalizedUrl,
      expiresAt,
      userId,
    });

    if (!parseResult.success) {
      return {
        success: false,
        error: parseResult.error.issues[0]?.message || "Invalid input",
      };
    }

    // Check if URL already exists
    const existingUrl = await prisma.url.findFirst({
      where: {
        originalUrl: normalizedUrl,
      },
    });

    if (existingUrl) {
      return {
        success: true,
        data: {
          id: existingUrl.id,
          originalUrl: existingUrl.originalUrl,
          shortCode: existingUrl.shortCode,
          shortUrl: getShortUrl(existingUrl.shortCode),
          clicks: existingUrl.clicks,
          createdAt: existingUrl.createdAt,
          expiresAt: existingUrl.expiresAt,
        },
      };
    }

    // Generate unique short code
    let shortCode = generateShortCode(6);
    let attempts = 0;
    const maxAttempts = 10;

    // Ensure short code is unique
    while (attempts < maxAttempts) {
      const existing = await prisma.url.findUnique({
        where: { shortCode },
      });

      if (!existing) break;

      shortCode = generateShortCode(6);
      attempts++;
    }

    if (attempts >= maxAttempts) {
      return {
        success: false,
        error: "Failed to generate unique short code. Please try again.",
      };
    }

    // Create new URL record
    const newUrl = await prisma.url.create({
      data: {
        originalUrl: normalizedUrl,
        shortCode,
        expiresAt: expiresAt || null,
        userId: userId || null,
      },
    });

    return {
      success: true,
      data: {
        id: newUrl.id,
        originalUrl: newUrl.originalUrl,
        shortCode: newUrl.shortCode,
        shortUrl: getShortUrl(newUrl.shortCode),
        clicks: newUrl.clicks,
        createdAt: newUrl.createdAt,
        expiresAt: newUrl.expiresAt,
      },
    };
  } catch (error) {
    console.error("Error creating short URL:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create short URL",
    };
  }
}

/**
 * Gets URL by short code and increments click count
 * - Fetches from database using Prisma
 * - Increments clicks count atomically
 * - Checks if expired
 */
export async function getUrlByShortCode(
  shortCode: string
): Promise<RedirectResult> {
  try {
    if (!shortCode || shortCode.length < 6) {
      return {
        success: false,
        error: "Invalid short code",
      };
    }

    // Find and update clicks atomically
    const url = await prisma.url.update({
      where: { shortCode },
      data: {
        clicks: {
          increment: 1,
        },
      },
    });

    if (!url) {
      return {
        success: false,
        error: "URL not found",
      };
    }

    // Check if expired
    if (isExpired(url.expiresAt)) {
      return {
        success: false,
        error: "This link has expired",
      };
    }

    return {
      success: true,
      originalUrl: url.originalUrl,
    };
  } catch (error) {
    // Handle case where URL doesn't exist (Prisma throws on update with non-existent record)
    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return {
        success: false,
        error: "URL not found",
      };
    }

    console.error("Error getting URL by short code:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to retrieve URL",
    };
  }
}

/**
 * Gets URL by short code without incrementing clicks
 * Used for preview/info purposes
 */
export async function getUrlInfo(shortCode: string): Promise<UrlResult> {
  try {
    if (!shortCode || shortCode.length < 6) {
      return {
        success: false,
        error: "Invalid short code",
      };
    }

    const url = await prisma.url.findUnique({
      where: { shortCode },
    });

    if (!url) {
      return {
        success: false,
        error: "URL not found",
      };
    }

    return {
      success: true,
      data: {
        id: url.id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: getShortUrl(url.shortCode),
        clicks: url.clicks,
        createdAt: url.createdAt,
        expiresAt: url.expiresAt,
      },
    };
  } catch (error) {
    console.error("Error getting URL info:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to retrieve URL info",
    };
  }
}

/**
 * Gets all URLs ordered by creation date (newest first)
 * - Fetches all URLs from database
 * - Includes all fields
 */
export async function getAllUrls(): Promise<UrlListResult> {
  try {
    const urls = await prisma.url.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: urls.map((url) => ({
        id: url.id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: getShortUrl(url.shortCode),
        clicks: url.clicks,
        createdAt: url.createdAt,
        expiresAt: url.expiresAt,
        userId: url.userId,
      })),
    };
  } catch (error) {
    console.error("Error getting all URLs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to retrieve URLs",
    };
  }
}

/**
 * Gets URLs by user ID
 */
export async function getUrlsByUserId(userId: string): Promise<UrlListResult> {
  try {
    if (!userId) {
      return {
        success: false,
        error: "User ID is required",
      };
    }

    const urls = await prisma.url.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: urls.map((url) => ({
        id: url.id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: getShortUrl(url.shortCode),
        clicks: url.clicks,
        createdAt: url.createdAt,
        expiresAt: url.expiresAt,
        userId: url.userId,
      })),
    };
  } catch (error) {
    console.error("Error getting URLs by user ID:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to retrieve user URLs",
    };
  }
}

/**
 * Deletes a URL by ID
 */
export async function deleteUrl(id: string): Promise<DeleteResult> {
  try {
    // Validate input
    const parseResult = deleteUrlSchema.safeParse({ id });

    if (!parseResult.success) {
      return {
        success: false,
        error: parseResult.error.issues[0]?.message || "Invalid URL ID",
      };
    }

    // Check if URL exists
    const existingUrl = await prisma.url.findUnique({
      where: { id },
    });

    if (!existingUrl) {
      return {
        success: false,
        error: "URL not found",
      };
    }

    // Delete the URL
    await prisma.url.delete({
      where: { id },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting URL:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete URL",
    };
  }
}

/**
 * Deletes a URL by short code
 */
export async function deleteUrlByShortCode(
  shortCode: string
): Promise<DeleteResult> {
  try {
    if (!shortCode || shortCode.length < 6) {
      return {
        success: false,
        error: "Invalid short code",
      };
    }

    // Check if URL exists
    const existingUrl = await prisma.url.findUnique({
      where: { shortCode },
    });

    if (!existingUrl) {
      return {
        success: false,
        error: "URL not found",
      };
    }

    // Delete the URL
    await prisma.url.delete({
      where: { shortCode },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting URL by short code:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete URL",
    };
  }
}
