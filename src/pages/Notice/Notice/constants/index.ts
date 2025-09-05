export const NOTICE_TABS = [
  "학사",
  "장학", 
  "취창업",
  "국제",
  "학생",
  "일반",
  "신학",
  "도서관",
] as const;

export const NOTICE_CONFIG = {
  DEFAULT_TAB: "학사",
  DEFAULT_PAGE_SIZE: 20,
} as const;

export const NOTICE_MESSAGES = {
  EMPTY_MESSAGE: "공지사항이 없습니다.",
  LOADING_MESSAGE: "로딩 중...",
  ERROR_FETCH: "공지사항 로드 실패:",
} as const;