import { ApiResponse } from ".";

// 검색 파라미터
export interface SearchNoticesParams {
  keyword: string;
  page?: number;
  size?: number;
}

// 키워드 알림
export interface KeywordListApiResponse extends ApiResponse {
  data: {
    keywords: string[];
  };
}

// 최근 검색어
export interface RecentSearch {
  id: number;
  userId: number;
  keyword: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecentSearchListApiResponse extends ApiResponse {
  data: RecentSearch[];
}
