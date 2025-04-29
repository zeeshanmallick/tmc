import { getRequestContext } from "@cloudflare/next-on-pages";

// Define the Cloudflare environment interface based on wrangler.toml bindings
export interface CloudflareEnv {
  DB: D1Database;
  ASSETS: Fetcher;
  // Add other bindings like KV namespaces, secrets, etc. here
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
}

/**
 * Retrieves the Cloudflare context, including environment variables and execution context.
 * This function should only be called from within Next.js API routes or server components
 * running in the Cloudflare Pages environment.
 */
export function getCloudflareContext() {
  // In production, use the actual Cloudflare context
  try {
    const context = getRequestContext<CloudflareEnv>();
    return context;
  } catch (error) {
    // Fallback for local development (will use wrangler dev which provides context)
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "Running in development mode. Using process.env for Cloudflare bindings."
      );
      // Attempt to provide a basic structure, but D1/ASSETS will likely not work fully
      // without `wrangler dev` running and providing the context.
      return {
        env: {
          DB: (globalThis as any).DB, // wrangler dev might inject DB here
          ASSETS: (globalThis as any).ASSETS,
          STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "sk_test_mock",
          STRIPE_WEBHOOK_SECRET:
            process.env.STRIPE_WEBHOOK_SECRET || "whsec_mock",
        } as CloudflareEnv,
        waitUntil: (promise: Promise<any>) => {},
        passThroughOnException: () => {},
      };
    }
    console.error("Error getting Cloudflare context:", error);
    throw new Error(
      "Failed to get Cloudflare context. Ensure you are running in a Cloudflare Pages environment or using wrangler dev."
    );
  }
}

// Helper function to get just the environment bindings
export function getCloudflareEnv(): CloudflareEnv {
  return getCloudflareContext().env;
}

