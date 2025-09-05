export const NOTICE_DETAIL_MESSAGES = {
  NOT_FOUND: "공지사항을 찾을 수 없습니다.",
  FETCH_ERROR: "공지사항을 불러오는데 실패했습니다.",
  BOOKMARK_TOGGLE_ERROR: "북마크 토글 실패:",
  ORIGINAL_LINK_TEXT: "원본 페이지에서 보기",
} as const;

export const NOTICE_DETAIL_CONFIG = {
  DEFAULT_PAGE_SIZE: 1000, // 충분히 많은 수로 설정하여 모든 공지사항 가져오기
  DEFAULT_CATEGORY: "학사",
} as const;