import type { Category } from "@/types/article";
import { cn } from "@/lib/utils";

interface CategoryToggleProps {
  value: Category;
  onChange: (next: Category) => void;
}

const OPTIONS: { value: Category; label: string }[] = [
  { value: "tech", label: "Tech" },
  { value: "idea", label: "Idea" },
];

export function CategoryToggle({ value, onChange }: CategoryToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="記事カテゴリ"
      className="inline-flex items-center rounded-lg border border-border bg-muted/40 p-0.5"
    >
      {OPTIONS.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition-colors",
              selected
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
