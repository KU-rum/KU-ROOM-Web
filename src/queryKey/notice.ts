export const NOTICE_QUERY_KEY = {
  LIST: (categoryId: string) => ["notices", "list", categoryId],
  DETAIL: (id: string | undefined, category?: string) => ["notices", "detail", id, category],
  POPULAR: ["notices", "popular"],
  PRIMARY: ["notices", "primary"],
  OTHERS: ["notices", "others"],
} as const;

export const BOOKMARK_QUERY_KEY = {
  LIST: ["bookmark", "list"],
} as const;

export const SEARCH_QUERY_KEY = {
  RESULTS: (keyword: string) => ["notices", "search", keyword],
  RECENT: ["notices", "searches", "recent"],
  KEYWORDS: ["notices", "keyword"],
} as const;
