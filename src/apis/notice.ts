import axios from "axios";

export interface NoticeResponse {
  id: number;
  categoryId: number;
  categoryName: string;
  title: string;
  link: string;
  pubDate: string;
  author: string;
  description: string;
  isBookMarked: boolean;
}

export interface NoticeListResponse {
  content: NoticeResponse[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface NoticeListParams {
  categoryId?: number;
  keyword?: string;
  page?: number;
  size?: number;
  sort?: string[];
}

export interface BookmarkResponse {
  id: number;
  title: string;
  pubDate: string;
  bookmarked: boolean;
  link?: string;
}

export interface BookmarkListResponse {
  content: BookmarkResponse[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface BookmarkListParams {
  page?: number;
  size?: number;
  sort?: string[];
}

const NOTICE_BASE_URL =
  import.meta.env.VITE_NOTICE_API_BASE_URL ?? "https://kuis.shop";

const noticeAxiosInstance = axios.create({
  baseURL: NOTICE_BASE_URL,
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
});

noticeAxiosInstance.interceptors.request.use(
  (config) => {
    let token: string | null = null;
    if (typeof window !== "undefined") {
      try {
        token = localStorage.getItem("accessToken");
      } catch (_) {
        throw Error;
      }
    }
    if (token) {
      if (!config.headers) config.headers = {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getNotices = async (
  params: NoticeListParams = {}
): Promise<NoticeResponse[]> => {
  const response = await noticeAxiosInstance.get<NoticeListResponse>(
    "/api/v1/notices",
    {
      params: {
        categoryId: params.categoryId,
        keyword: params.keyword,
        page: params.page || 0,
        size: params.size || 20,
        sort: params.sort,
      },
    }
  );
  return response.data.content;
};

export const getBookmarks = async (
  params: BookmarkListParams = {}
): Promise<BookmarkResponse[]> => {
  const response = await noticeAxiosInstance.get<BookmarkListResponse>(
    "/api/v1/notices/bookmarks",
    {
      params: {
        page: params.page || 0,
        size: params.size || 20,
        sort: params.sort,
      },
    }
  );
  return response.data.content;
};

// kuis.shop 서버용 북마크 API (토큰 인증 필요)
export const addBookmark = async (noticeId: number): Promise<void> => {
  await noticeAxiosInstance.post(`/api/v1/notices/${noticeId}/bookmark`);
};

export const removeBookmark = async (noticeId: number): Promise<void> => {
  await noticeAxiosInstance.delete(`/api/v1/notices/${noticeId}/bookmark`);
};
