import axios from "axios";

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

export interface BookmarkListParams {
  page?: number;
  size?: number;
  sort?: string[];
}

export interface AddBookmarkRequest {
  noticeId: number;
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

const BOOKMARK_BASE_URL = "https://kuroom.shop/api/v1";

const bookmarkAxiosInstance = axios.create({
  baseURL: BOOKMARK_BASE_URL,
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
});

bookmarkAxiosInstance.interceptors.request.use(
  (config) => {
    let token: string | null = null;
    if (typeof window !== "undefined") {
      try {
        token = localStorage.getItem("accessToken");
      } catch (_) {
        token = null;
      }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getBookmarks = async (): Promise<BookmarkResponse[]> => {
  const response = await bookmarkAxiosInstance.get<BookmarkApiResponse>(
    "/bookmark"
  );
  return response.data.data;
};

export const addBookmark = async (noticeId: number): Promise<number> => {
  const response = await bookmarkAxiosInstance.post<AddBookmarkApiResponse>(
    "/bookmark",
    {
      noticeId,
    }
  );
  return response.data.data.bookmarkId;
};

export const removeBookmark = async (bookmarkId: number): Promise<void> => {
  await bookmarkAxiosInstance.delete<RemoveBookmarkApiResponse>(
    `/bookmark/${bookmarkId}`
  );
};
