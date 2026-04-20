import { useEffect, useState } from "react";
import type { Category } from "@/types/article";
import { useArticles } from "@/hooks/useArticles";
import { Header } from "./components/Header";
import { ArticleList } from "./components/ArticleList";

export function App() {
  const [category, setCategory] = useState<Category>("tech");
  const {
    articles,
    loading,
    error,
    cachedAt,
    fetch: fetchArticles,
    refetch,
  } = useArticles();

  useEffect(() => {
    fetchArticles(category);
  }, [category, fetchArticles]);

  const handleRefresh = () => refetch(category);

  return (
    <div className="flex min-h-[500px] w-[400px] flex-col">
      <Header
        category={category}
        onCategoryChange={setCategory}
        onRefresh={handleRefresh}
        cachedAt={cachedAt}
        refreshing={loading}
      />
      <div className="flex-1 overflow-y-auto">
        <ArticleList
          articles={articles}
          loading={loading}
          error={error}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
}
