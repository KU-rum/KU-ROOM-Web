import axiosInstance from "./axiosInstance";
import { NoticeListResponse } from "./notice";

export interface SearchNoticesParams {
  keyword: string;
  page?: number;
  size?: number;
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

export const searchNotices = async (
  params: SearchNoticesParams,
): Promise<NoticeListResponse> => {
  const response = await axiosInstance.get<NoticeListResponse>(
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
  const response = await axiosInstance.post<KeywordRegisterResponse>(
    "/notices/keyword",
    { keyword },
  );
  return response.data;
};

export const getKeywords = async (): Promise<string[]> => {
  const response =
    await axiosInstance.get<KeywordListResponse>("/notices/keyword");
  return response.data.data.keywords;
};

export const getRecentSearches = async (
  limit: number = 20,
): Promise<RecentSearch[]> => {
  const response = await axiosInstance.get<RecentSearchListResponse>(
    "/notices/searches/recent",
    { params: { limit } },
  );
  return response.data.data;
};

export const deleteRecentSearch = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/notices/searches/recent/${id}`);
};

export const deleteAllRecentSearches = async (): Promise<void> => {
  await axiosInstance.delete("/notices/searches/recent/all");
};

export const saveRecentSearch = async (keyword: string): Promise<void> => {
  await axiosInstance.post("/notices/searches/recent", null, {
    params: { keyword },
  });
};
