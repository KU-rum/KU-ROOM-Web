import { ApiResponse } from ".";

// 북마크 항목
export interface BookmarkResponse {
  bookmarkId: number;
  noticeId: number;
  noticeName: string;
  noticePubDate: string;
  bookmarkDate: string;
  categoryId?: number;
}

export interface BookmarkListApiResponse extends ApiResponse {
  data: BookmarkResponse[];
}

// 북마크 추가 응답
export interface AddBookmarkData {
  bookmarkId: number;
}

export interface AddBookmarkApiResponse extends ApiResponse {
  data: AddBookmarkData;
}
