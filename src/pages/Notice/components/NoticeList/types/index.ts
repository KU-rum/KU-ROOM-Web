import type { NoticeResponse } from "@apis/notice";

export interface NoticeListProps {
  notices: NoticeResponse[];
  loading?: boolean;
  error?: string | null;
  showBookmarkButton?: boolean;
  showSortOptions?: boolean;
  emptyMessage?: string;
  onBookmarkToggle?: (noticeId: number) => void;
  onRetry?: () => void;
}

export interface SortState {
  sortOrder: string;
  showSort: boolean;
  sortedNotices: NoticeResponse[];
}

export type SortOption = "최신순" | "오래된 순" | "북마크 등록순" | "가나다 순";