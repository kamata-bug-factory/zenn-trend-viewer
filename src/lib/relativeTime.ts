const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
// Approximations per docs/SPEC.md: 1 month = 30 days, 1 year = 365 days.
const MONTH_MS = 30 * DAY_MS;
const YEAR_MS = 365 * DAY_MS;

/**
 * Format an ISO date string as a Japanese relative time label.
 * Falls back to an empty string when the input cannot be parsed.
 *
 * Rules (per docs/SPEC.md):
 * - < 1 minute  → "たった今"
 * - < 1 hour    → "〇分前"
 * - < 1 day     → "〇時間前"
 * - < 1 month   → "〇日前"
 * - < 1 year    → "〇カ月前"
 * - >= 1 year   → "〇年前"
 */
export function formatRelativeTime(
  isoDate: string,
  now: number = Date.now(),
): string {
  if (!isoDate) return "";

  const target = new Date(isoDate).getTime();
  if (Number.isNaN(target)) return "";

  const diffMs = Math.max(0, now - target);

  if (diffMs < MINUTE_MS) {
    return "たった今";
  }
  if (diffMs < HOUR_MS) {
    return `${Math.floor(diffMs / MINUTE_MS)}分前`;
  }
  if (diffMs < DAY_MS) {
    return `${Math.floor(diffMs / HOUR_MS)}時間前`;
  }
  if (diffMs < MONTH_MS) {
    return `${Math.floor(diffMs / DAY_MS)}日前`;
  }
  if (diffMs < YEAR_MS) {
    return `${Math.floor(diffMs / MONTH_MS)}カ月前`;
  }
  return `${Math.floor(diffMs / YEAR_MS)}年前`;
}
