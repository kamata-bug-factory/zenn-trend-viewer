import type { ArticleDetail } from "@/types/article";
import { ArticleCard } from "./ArticleCard";
import { ArticleListSkeleton } from "./ArticleListSkeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ArticleListProps {
  articles: ArticleDetail[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function ArticleList({
  articles,
  loading,
  error,
  onRefresh,
}: ArticleListProps) {
  if (loading && articles.length === 0) {
    return <ArticleListSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
        <AlertCircle className="size-8 text-destructive" />
        <div className="space-y-1">
          <p className="text-sm font-medium">取得に失敗しました</p>
          <p className="text-xs text-muted-foreground">{error}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="size-3.5" />
          再試行
        </Button>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
        <p className="text-sm text-muted-foreground">記事が見つかりません</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {articles.map((article, i) => (
        <ArticleCard key={article.id} article={article} rank={i + 1} />
      ))}
    </div>
  );
}
