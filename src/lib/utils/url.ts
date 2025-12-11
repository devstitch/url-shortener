import { z } from "zod";

// ============================================================================
// Zod Schemas
// ============================================================================

export const urlSchema = z
  .string()
  .url("Please enter a valid URL")
  .min(1, "URL is required");

export const shortCodeSchema = z
  .string()
  .min(6, "Short code must be at least 6 characters")
  .max(8, "Short code must be at most 8 characters")
  .regex(/^[a-zA-Z0-9]+$/, "Short code must be alphanumeric");

export const createUrlSchema = z.object({
  originalUrl: urlSchema,
  expiresAt: z.date().optional(),
  userId: z.string().optional(),
});

export const deleteUrlSchema = z.object({
  id: z.string().uuid("Invalid URL ID"),
});

// ============================================================================
// Types
// ============================================================================

export type CreateUrlInput = z.infer<typeof createUrlSchema>;
export type DeleteUrlInput = z.infer<typeof deleteUrlSchema>;

export interface UrlResult {
  success: boolean;
  data?: {
    id: string;
    originalUrl: string;
    shortCode: string;
    shortUrl: string;
    clicks: number;
    createdAt: Date;
    expiresAt: Date | null;
  };
  error?: string;
}

export interface UrlListResult {
  success: boolean;
  data?: Array<{
    id: string;
    originalUrl: string;
    shortCode: string;
    shortUrl: string;
    clicks: number;
    createdAt: Date;
    expiresAt: Date | null;
    userId: string | null;
  }>;
  error?: string;
}

export interface DeleteResult {
  success: boolean;
  error?: string;
}

export interface RedirectResult {
  success: boolean;
  originalUrl?: string;
  error?: string;
}

// ============================================================================
// Utility Functions
// ============================================================================

const ALPHANUMERIC_CHARS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Generates a unique random alphanumeric short code
 * @param length - Length of the short code (default: 6)
 * @returns Random alphanumeric string
 */
export function generateShortCode(length: number = 6): string {
  let result = "";
  const charactersLength = ALPHANUMERIC_CHARS.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += ALPHANUMERIC_CHARS.charAt(randomIndex);
  }

  return result;
}

/**
 * Validates if a string is a valid URL
 * @param url - URL string to validate
 * @returns Object with success status and optional error message
 */
export function validateUrl(url: string): { valid: boolean; error?: string } {
  const result = urlSchema.safeParse(url);

  if (!result.success) {
    return {
      valid: false,
      error: result.error.issues[0]?.message || "Invalid URL",
    };
  }

  // Additional validation: check if URL has a valid protocol
  try {
    const parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return {
        valid: false,
        error: "URL must use http or https protocol",
      };
    }
  } catch {
    return {
      valid: false,
      error: "Invalid URL format",
    };
  }

  return { valid: true };
}

/**
 * Checks if a URL has expired
 * @param expiresAt - Expiration date or null
 * @returns true if expired, false otherwise
 */
export function isExpired(expiresAt: Date | null): boolean {
  if (!expiresAt) {
    return false;
  }
  return new Date() > new Date(expiresAt);
}

/**
 * Generates the full short URL from a short code
 * @param shortCode - The short code
 * @returns Full short URL
 */
export function getShortUrl(shortCode: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return `${baseUrl}/${shortCode}`;
}

/**
 * Normalizes a URL by ensuring it has a protocol
 * @param url - URL to normalize
 * @returns Normalized URL with protocol
 */
export function normalizeUrl(url: string): string {
  const trimmedUrl = url.trim();

  // If URL doesn't have a protocol, add https://
  if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
    return `https://${trimmedUrl}`;
  }

  return trimmedUrl;
}
