import type { ArticleDetail } from "@/types/article";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { formatRelativeTime } from "@/lib/relativeTime";

interface ArticleCardProps {
  article: ArticleDetail;
  rank: number;
}

export function ArticleCard({ article, rank }: ArticleCardProps) {
  const relativeTime = formatRelativeTime(article.publishedAt);

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/60"
    >
      <span
        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded text-[11px] font-bold text-muted-foreground"
        aria-label={`${rank}位`}
      >
        {rank}
      </span>

      <div className="min-w-0 flex-1 space-y-1.5">
        <p className="text-[13px] font-medium leading-snug text-foreground group-hover:text-primary">
          {article.emoji && (
            <span className="mr-1" aria-hidden>
              {article.emoji}
            </span>
          )}
          {article.title}
        </p>

        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>@{article.author}</span>
          {relativeTime && (
            <time dateTime={article.publishedAt}>{relativeTime}</time>
          )}
          <span className="flex items-center gap-0.5">
            <Heart className="size-3" />
            {article.likesCount}
          </span>
        </div>

        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
