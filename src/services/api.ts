import type { ArticleDetail, Category, FeedArticle } from "@/types/article";

const API_BASE = "https://zenn.dev/api";
const SITE_BASE = "https://zenn.dev";
const TOP_N = 10;

interface ZennUser {
  username: string;
  name: string;
}

interface ZennListArticle {
  id: number;
  slug: string;
  title: string;
  emoji: string;
  path: string;
  published_at: string;
  liked_count: number;
  user: ZennUser;
}

interface ZennListResponse {
  articles: ZennListArticle[];
}

interface ZennTopic {
  name: string;
  display_name: string;
}

interface ZennDetailResponse {
  article: {
    topics?: ZennTopic[];
  };
}

function toFeedArticle(raw: ZennListArticle): FeedArticle {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    emoji: raw.emoji,
    author: raw.user.name || raw.user.username,
    url: `${SITE_BASE}${raw.path}`,
    publishedAt: raw.published_at,
    likesCount: raw.liked_count,
  };
}

export async function fetchTrendList(
  category: Category,
): Promise<FeedArticle[]> {
  const response = await fetch(
    `${API_BASE}/articles?order=daily&article_type=${category}`,
    { headers: { Accept: "application/json" } },
  );

  if (!response.ok) {
    throw new Error(`Zenn API error: ${response.status}`);
  }

  const data = (await response.json()) as ZennListResponse;
  return data.articles.slice(0, TOP_N).map(toFeedArticle);
}

// Zenn's list endpoint omits `topics`, so tag info requires a per-article
// detail call. Detail responses are keyed by slug regardless of author.
async function fetchTopics(slug: string): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE}/articles/${slug}`, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return [];
    const data = (await response.json()) as ZennDetailResponse;
    const topics = data.article?.topics ?? [];
    return topics.map((t) => t.display_name || t.name);
  } catch {
    return [];
  }
}

export async function fetchArticleDetails(
  feedArticles: FeedArticle[],
): Promise<ArticleDetail[]> {
  const results = await Promise.all(
    feedArticles.map(async (article) => ({
      ...article,
      tags: await fetchTopics(article.slug),
    })),
  );
  return results;
}
