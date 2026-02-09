import axios from "axios";
import { NoticeListResponse } from "./notice";

export interface SearchNoticesParams {
  keyword: string;
  page?: number;
  size?: number;
}

export interface KeywordRegisterRequest {
  keyword: string;
}

export interface KeywordRegisterResponse {
  code: number;
  status: string;
  message: string;
}

export interface KeywordListResponse {
  code: number;
  status: string;
  message: string;
  data: {
    keywords: string[];
  };
}

export interface RecentSearch {
  id: number;
  userId: number;
  keyword: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecentSearchListResponse {
  code: number;
  status: string;
  message: string;
  data: RecentSearch[];
}

export interface DeleteRecentSearchResponse {
  code: number;
  status: string;
  message: string;
}

export interface DeleteAllRecentSearchesResponse {
  code: number;
  status: string;
  message: string;
}

export interface SaveRecentSearchResponse {
  code: number;
  status: string;
  message: string;
}

const SEARCH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const searchAxiosInstance = axios.create({
  baseURL: SEARCH_BASE_URL,
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
});

searchAxiosInstance.interceptors.request.use(
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

export const searchNotices = async (
  params: SearchNoticesParams,
): Promise<NoticeListResponse> => {
  const response = await searchAxiosInstance.get<NoticeListResponse>(
    "/notices/search",
    {
      params: {
        keyword: params.keyword,
        page: params.page || 0,
        size: params.size || 20,
      },
    },
  );
  return response.data;
};

export const registerKeyword = async (
  keyword: string,
): Promise<KeywordRegisterResponse> => {
  const response = await searchAxiosInstance.post<KeywordRegisterResponse>(
    "/notices/keyword",
    {
      keyword,
    },
  );
  return response.data;
};

export const getKeywords = async (): Promise<string[]> => {
  const response =
    await searchAxiosInstance.get<KeywordListResponse>("/notices/keyword");
  return response.data.data.keywords;
};

export const getRecentSearches = async (
  limit: number = 20,
): Promise<RecentSearch[]> => {
  const response = await searchAxiosInstance.get<RecentSearchListResponse>(
    "/notices/searches/recent",
    {
      params: { limit },
    },
  );
  return response.data.data;
};

export const deleteRecentSearch = async (
  id: number,
): Promise<DeleteRecentSearchResponse> => {
  const response = await searchAxiosInstance.delete<DeleteRecentSearchResponse>(
    `/notices/searches/recent/${id}`,
  );
  return response.data;
};

export const deleteAllRecentSearches =
  async (): Promise<DeleteAllRecentSearchesResponse> => {
    const response =
      await searchAxiosInstance.delete<DeleteAllRecentSearchesResponse>(
        "/notices/searches/recent/all",
      );
    return response.data;
  };

export const saveRecentSearch = async (
  keyword: string,
): Promise<SaveRecentSearchResponse> => {
  const response = await searchAxiosInstance.post<SaveRecentSearchResponse>(
    "/notices/searches/recent",
    null,
    {
      params: { keyword },
    },
  );
  return response.data;
};
