import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types/article";
import { CategoryToggle } from "./CategoryToggle";

interface HeaderProps {
  category: Category;
  onCategoryChange: (next: Category) => void;
  onRefresh: () => void;
  cachedAt: number | null;
  refreshing: boolean;
}

function formatUpdatedAt(cachedAt: number): string {
  const diffMs = Date.now() - cachedAt;
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return "たった今更新";
  if (diffMin < 60) return `${diffMin}分前に更新`;

  const diffHour = Math.floor(diffMin / 60);
  return `${diffHour}時間前に更新`;
}

export function Header({
  category,
  onCategoryChange,
  onRefresh,
  cachedAt,
  refreshing,
}: HeaderProps) {
  return (
    <header className="flex flex-col gap-2 border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/icons/icon48.png" alt="" className="size-5" />
          <div>
            <h1 className="text-sm font-bold leading-none tracking-tight">
              Zenn Trend
            </h1>
            {cachedAt !== null && (
              <p className="mt-0.5 text-[10px] leading-none text-muted-foreground">
                {formatUpdatedAt(cachedAt)}
              </p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onRefresh}
          aria-label="Refresh"
          disabled={refreshing}
        >
          <RefreshCw
            className={refreshing ? "size-3.5 animate-spin" : "size-3.5"}
          />
        </Button>
      </div>
      <CategoryToggle value={category} onChange={onCategoryChange} />
    </header>
  );
}
