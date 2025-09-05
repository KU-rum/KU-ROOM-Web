import type { NoticeResponse } from "@apis/notice";

export interface BookmarkPageProps {
  className?: string;
}

export interface BookmarkState {
  bookmarks: NoticeResponse[];
  loading: boolean;
  error: string | null;
}

export type { NoticeResponse as BookmarkItem } from "@apis/notice";