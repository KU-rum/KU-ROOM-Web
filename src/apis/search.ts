// tanstack query 리팩토링 완료
// 검색 관련 api
import axiosInstance from "./axiosInstance";
import {
  NoticeListResponse,
  SearchNoticesParams,
  KeywordListApiResponse,
  RecentSearchListApiResponse,
} from "./types";

export type { SearchNoticesParams, RecentSearch } from "./types";

const SEARCH_NOTICES = "/notices/search";
const REGISTER_KEYWORD = "/notices/keyword";
const GET_KEYWORDS = "/notices/keyword";
const GET_RECENT_SEARCHES = "/notices/searches/recent";
const DELETE_RECENT_SEARCH = (id: number) => `/notices/searches/recent/${id}`;
const DELETE_ALL_RECENT_SEARCHES = "/notices/searches/recent/all";
const SAVE_RECENT_SEARCH = "/notices/searches/recent";

// 공지사항 검색 api
export const searchNoticesApi = async (
  params: SearchNoticesParams,
): Promise<NoticeListResponse> => {
  const response = await axiosInstance.get<NoticeListResponse>(SEARCH_NOTICES, {
    params: {
      keyword: params.keyword,
      page: params.page || 0,
      size: params.size || 20,
    },
  });
  return response.data;
};

// 키워드 알림 등록/해제 api
export const registerKeywordApi = async (keyword: string): Promise<void> => {
  await axiosInstance.post(REGISTER_KEYWORD, { keyword });
};

// 등록된 키워드 알림 목록 조회 api
export const getKeywordsApi = async (): Promise<string[]> => {
  const response =
    await axiosInstance.get<KeywordListApiResponse>(GET_KEYWORDS);
  return response.data.data.keywords;
};

// 최근 검색어 목록 조회 api
export const getRecentSearchesApi = async (limit: number = 20) => {
  const response = await axiosInstance.get<RecentSearchListApiResponse>(
    GET_RECENT_SEARCHES,
    { params: { limit } },
  );
  return response.data.data;
};

// 최근 검색어 저장 api
export const saveRecentSearchApi = async (keyword: string): Promise<void> => {
  await axiosInstance.post(SAVE_RECENT_SEARCH, null, { params: { keyword } });
};

// 최근 검색어 개별 삭제 api
export const deleteRecentSearchApi = async (id: number): Promise<void> => {
  await axiosInstance.delete(DELETE_RECENT_SEARCH(id));
};

// 최근 검색어 전체 삭제 api
export const deleteAllRecentSearchesApi = async (): Promise<void> => {
  await axiosInstance.delete(DELETE_ALL_RECENT_SEARCHES);
};
