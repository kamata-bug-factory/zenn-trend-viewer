import { useCallback, useState } from "react";
import type { ArticleDetail, Category } from "@/types/article";
import {
  clearAllCachedArticles,
  getCachedArticles,
  setCachedArticles,
} from "@/storage/cache";
import { fetchArticleDetails, fetchTrendList } from "@/services/api";

interface UseArticlesResult {
  articles: ArticleDetail[];
  loading: boolean;
  error: string | null;
  cachedAt: number | null;
  fetch: (category: Category) => void;
  refetch: (category: Category) => void;
}

async function fetchFromNetwork(category: Category): Promise<ArticleDetail[]> {
  const feed = await fetchTrendList(category);
  const details = await fetchArticleDetails(feed);
  await setCachedArticles(category, details);
  return details;
}

export function useArticles(): UseArticlesResult {
  const [articles, setArticles] = useState<ArticleDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cachedAt, setCachedAt] = useState<number | null>(null);

  const fetchArticles = useCallback(async (category: Category) => {
    setLoading(true);
    setError(null);

    try {
      const cached = await getCachedArticles(category);
      if (cached) {
        setArticles(cached.articles);
        setCachedAt(cached.cachedAt);
        return;
      }

      // Clear the previous category's articles on a cache miss so the
      // skeleton renders immediately while the network request is in flight.
      setArticles([]);
      setCachedAt(null);

      const details = await fetchFromNetwork(category);
      setArticles(details);
      setCachedAt(Date.now());
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setError(message);
      setArticles([]);
      setCachedAt(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetchArticles = useCallback(async (category: Category) => {
    setLoading(true);
    setError(null);
    // Clear the current articles so the skeleton is shown while refreshing.
    setArticles([]);
    setCachedAt(null);

    try {
      await clearAllCachedArticles();
      const details = await fetchFromNetwork(category);
      setArticles(details);
      setCachedAt(Date.now());
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setError(message);
      setArticles([]);
      setCachedAt(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    articles,
    loading,
    error,
    cachedAt,
    fetch: fetchArticles,
    refetch: refetchArticles,
  };
}
