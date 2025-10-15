/**
 * Generate ISO UTC timestamp string.
 */
export function nowIso(): string {
  return new Date().toISOString();
}

/**
 * Generate a unique id (ULID-style friendly, fallback to random UUID).
 */
export function uid(): string {
  // If crypto.randomUUID available → use it
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Otherwise fallback to timestamp + random
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 10)
  ).toUpperCase();
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
