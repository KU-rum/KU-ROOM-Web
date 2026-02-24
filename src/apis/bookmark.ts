// tanstack query 리팩토링 완료
// 북마크 관련 api
import axiosInstance from "./axiosInstance";
import {
  BookmarkListApiResponse,
  AddBookmarkApiResponse,
} from "./types";

export type { BookmarkResponse } from "./types";

const GET_BOOKMARKS = "/bookmark";
const ADD_BOOKMARK = "/bookmark";
const REMOVE_BOOKMARK = (bookmarkId: number) => `/bookmark/${bookmarkId}`;

// 북마크 목록 조회 api
export const getBookmarksApi = async () => {
  const response =
    await axiosInstance.get<BookmarkListApiResponse>(GET_BOOKMARKS);
  return response.data.data;
};

// 북마크 추가 api
export const addBookmarkApi = async (noticeId: number): Promise<number> => {
  const response = await axiosInstance.post<AddBookmarkApiResponse>(
    ADD_BOOKMARK,
    { noticeId },
  );
  return response.data.data.bookmarkId;
};

// 북마크 삭제 api
export const removeBookmarkApi = async (bookmarkId: number): Promise<void> => {
  await axiosInstance.delete(REMOVE_BOOKMARK(bookmarkId));
};
