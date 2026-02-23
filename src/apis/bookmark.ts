import axiosInstance from "./axiosInstance";

export interface BookmarkResponse {
  bookmarkId: number;
  noticeId: number;
  noticeName: string;
  noticePubDate: string;
  bookmarkDate: string;
  categoryId?: number;
}

export interface BookmarkApiResponse {
  code: number;
  status: string;
  message: string;
  data: BookmarkResponse[];
}

export interface AddBookmarkData {
  bookmarkId: number;
}

export interface AddBookmarkApiResponse {
  code: number;
  status: string;
  message: string;
  data: AddBookmarkData;
}

export interface RemoveBookmarkApiResponse {
  code: number;
  status: string;
  message: string;
}

export const getBookmarks = async (): Promise<BookmarkResponse[]> => {
  const response = await axiosInstance.get<BookmarkApiResponse>("/bookmark");
  return response.data.data;
};

export const addBookmark = async (noticeId: number): Promise<number> => {
  const response = await axiosInstance.post<AddBookmarkApiResponse>(
    "/bookmark",
    { noticeId },
  );
  return response.data.data.bookmarkId;
};

export const removeBookmark = async (bookmarkId: number): Promise<void> => {
  await axiosInstance.delete<RemoveBookmarkApiResponse>(
    `/bookmark/${bookmarkId}`,
  );
};
