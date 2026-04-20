export type Category = "tech" | "idea";

export interface FeedArticle {
  id: number;
  slug: string;
  title: string;
  author: string;
  url: string;
  publishedAt: string;
  likesCount: number;
  emoji: string;
}

export interface ArticleDetail extends FeedArticle {
  tags: string[];
}

export interface CachedArticles {
  articles: ArticleDetail[];
  cachedAt: number;
}
