import axios from "axios";
import axiosInstance from "./axiosInstance";
import { ApiResponse } from "./types";

export interface NoticeResponse {
  id: number;
  categoryId: number;
  categoryName: string;
  title: string;
  link: string;
  content: string;
  pubDate: string;
  author: string;
  description: string;
  isBookMarked: boolean;
  bookmarkId?: number;
}

export interface PageableSort {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: PageableSort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface NoticeListResponse {
  content: NoticeResponse[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: PageableSort;
  numberOfElements: number;
  empty: boolean;
}

export interface NoticeListParams {
  category?: string;
  keyword?: string;
  page?: number;
  size?: number;
  sort?: string[];
}

export interface NoticeDetailData {
  id: number;
  content: string;
  link: string;
  title: string;
  pubdate: string;
  isBookmark: boolean;
  bookmarkId?: number;
}

export interface NoticeDetailApiResponse {
  code: number;
  status: string;
  message: string;
  data: NoticeDetailData;
}

const NOTICE_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
        token = null;
      }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const getNotices = async (
  params: NoticeListParams = {},
): Promise<NoticeListResponse> => {
  const response = await noticeAxiosInstance.get<NoticeListResponse>(
    "/notices",
    {
      params: {
        category: params.category,
        keyword: params.keyword,
        page: params.page || 0,
        size: params.size || 20,
        sort: params.sort,
      },
    },
  );
  return response.data;
};

export const getNoticeDetail = async (
  noticeId: string,
): Promise<NoticeDetailData> => {
  try {
    const response = await noticeAxiosInstance.get<NoticeDetailApiResponse>(
      `/notices/${noticeId}`,
    );
    return response.data.data;
  } catch (error: any) {
    console.error("공지사항 상세 조회 실패:", error);
    throw error;
  }
};

export interface PopularNoticeResponse {
  code: number;
  status: string;
  message: string;
  data: NoticeResponse[];
}

export const getPopularNotices = async (): Promise<NoticeResponse[]> => {
  const response =
    await noticeAxiosInstance.get<PopularNoticeResponse>("/notices/popular");
  return response.data.data;
};

export interface PrimaryNoticeResponse {
  code: number;
  status: string;
  message: string;
  data: NoticeResponse[];
}

export const getPrimaryNotices = async (): Promise<NoticeResponse[]> => {
  const response =
    await noticeAxiosInstance.get<PrimaryNoticeResponse>("/notices/primary");
  return response.data.data;
};

// 공지사항 기타 탭
export interface DepartmentUrlData {
  name: string;
  url: string;
}

interface NoticeOthersResponse extends ApiResponse {
  data: DepartmentUrlData[];
}

const NOTICE_OTHERS_URL = "/departments/url";
export const getNoticeOthersApi = async () => {
  const response =
    await axiosInstance.get<NoticeOthersResponse>(NOTICE_OTHERS_URL);
  return response.data.data;
};
