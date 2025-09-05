export const SORT_OPTIONS = [
  "최신순",
  "오래된 순", 
  "북마크 등록순",
  "가나다 순"
] as const;

export const DEFAULT_SORT_ORDER = "최신순";

export const NOTICE_LIST_MESSAGES = {
  DEFAULT_EMPTY: "공지사항이 없습니다.",
  LOADING: "공지사항을 불러오는 중...",
  RETRY_BUTTON: "다시 시도",
  BOOKMARK_ADD: "북마크 추가",
  BOOKMARK_REMOVE: "북마크 해제",
  BOOKMARK_ADDED: "북마크됨",
  BOOKMARK_NOT_ADDED: "북마크",
} as const;