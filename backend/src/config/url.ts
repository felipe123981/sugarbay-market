import { Request } from 'express';

/**
 * Get the base URL for the current request.
 *
 * This function handles both local development and production deployments
 * (cloudflared tunnel, reverse proxies, etc.) by checking:
 *
 * 1. X-Forwarded-Host header (set by cloudflared and most reverse proxies)
 * 2. Host header (direct access)
 * 3. process.env.APP_API_URL (fallback for backward compatibility)
 *
 * @param request - The Express request object
 * @returns The base URL without trailing slash (e.g., https://example.com)
 */
export function getBaseUrl(request: Request): string {
  // Check for X-Forwarded-Host header (cloudflared sets this)
  const forwardedHost = request.header('X-Forwarded-Host');
  const forwardedProto = request.header('X-Forwarded-Proto');

  if (forwardedHost) {
    const protocol = forwardedProto || 'https';
    return `${protocol}://${forwardedHost}`;
  }

  // Fall back to the configured APP_API_URL environment variable
  return process.env.APP_API_URL || `${request.protocol}://${request.get('host')}`;
}

/**
 * Get the API base URL for generating absolute URLs.
 *
 * For backward compatibility, this uses the environment variable.
 * For tunnel/proxy deployments, use getBaseUrl(request) instead.
 *
 * @returns The configured API URL or default localhost
 */
export function getApiBaseUrl(): string {
  return process.env.APP_API_URL || 'http://localhost:3333';
}

/**
 * Get the web base URL for generating links (e.g., password reset).
 *
 * @returns The configured web URL or default localhost
 */
export function getWebBaseUrl(): string {
  return process.env.APP_WEB_URL || 'http://localhost:3000';
}
