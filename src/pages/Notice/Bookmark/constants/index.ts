export const BOOKMARK_MESSAGES = {
  EMPTY_MESSAGE: "북마크한 공지사항이 없습니다.",
  LOADING_MESSAGE: "공지사항을 불러오는 중...",
  ERROR_FETCH: "북마크 데이터를 불러오는데 실패했습니다.",
} as const;

export const BOOKMARK_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_SORT: ["pubDate,desc"],
} as const;