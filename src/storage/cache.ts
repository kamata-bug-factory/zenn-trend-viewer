import type { ArticleDetail, CachedArticles, Category } from "@/types/article";

const CACHE_KEY_PREFIX = "zenn_articles_cache_v1";
const CACHE_TTL_MS = 3 * 60 * 60 * 1000; // 3 hours

function cacheKey(category: Category): string {
  return `${CACHE_KEY_PREFIX}_${category}`;
}

export async function getCachedArticles(
  category: Category,
): Promise<CachedArticles | null> {
  const key = cacheKey(category);
  const result = await chrome.storage.local.get(key);
  const cached = result[key] as CachedArticles | undefined;

  if (!cached) return null;

  const isExpired = Date.now() - cached.cachedAt > CACHE_TTL_MS;
  if (isExpired) {
    await chrome.storage.local.remove(key);
    return null;
  }

  return cached.articles.length > 0 ? cached : null;
}

export async function setCachedArticles(
  category: Category,
  articles: ArticleDetail[],
): Promise<void> {
  if (articles.length === 0) return;

  const cached: CachedArticles = {
    articles,
    cachedAt: Date.now(),
  };
  await chrome.storage.local.set({ [cacheKey(category)]: cached });
}

export async function clearAllCachedArticles(): Promise<void> {
  await chrome.storage.local.remove([cacheKey("tech"), cacheKey("idea")]);
}
