// 공지사항, 북마크, 검색 관련 api
import axiosInstance from "./axiosInstance";
import {
  NoticeListResponse,
  NoticeListParams,
  NoticeDetailData,
  NoticeDetailApiResponse,
  NoticeListApiResponse,
  DepartmentUrlData,
  NoticeOthersResponse,
  BookmarkListApiResponse,
  AddBookmarkApiResponse,
  KeywordListApiResponse,
  RecentSearchListApiResponse,
} from "./types";

export type {
  NoticeResponse,
  NoticeListResponse,
  NoticeListParams,
  NoticeDetailData,
  DepartmentUrlData,
  BookmarkResponse,
  SearchNoticesParams,
  RecentSearch,
} from "./types";

const GET_NOTICES = "/notices";
const GET_NOTICE_DETAIL = (noticeId: string) => `/notices/${noticeId}`;
const GET_POPULAR_NOTICES = "/notices/popular";
const GET_PRIMARY_NOTICES = "/notices/primary";
const GET_NOTICE_OTHERS = "/departments/url";
const GET_BOOKMARKS = "/bookmark";
const ADD_BOOKMARK = "/bookmark";
const REMOVE_BOOKMARK = (bookmarkId: number) => `/bookmark/${bookmarkId}`;
const SEARCH_NOTICES = "/notices/search";
const REGISTER_KEYWORD = "/notices/keyword";
const GET_KEYWORDS = "/notices/keyword";
const GET_RECENT_SEARCHES = "/notices/searches/recent";
const DELETE_RECENT_SEARCH = (id: number) => `/notices/searches/recent/${id}`;
const DELETE_ALL_RECENT_SEARCHES = "/notices/searches/recent/all";
const SAVE_RECENT_SEARCH = "/notices/searches/recent";

// ===================== 공지사항 API =====================

// 공지사항 목록 조회 api
export const getNoticesApi = async (
  params: NoticeListParams = {},
): Promise<NoticeListResponse> => {
  const response = await axiosInstance.get<NoticeListResponse>(GET_NOTICES, {
    params: {
      category: params.category,
      keyword: params.keyword,
      page: params.page || 0,
      size: params.size || 20,
      sort: params.sort,
    },
  });
  return response.data;
};

// 공지사항 상세 조회 api
export const getNoticeDetailApi = async (
  noticeId: string,
): Promise<NoticeDetailData> => {
  const response = await axiosInstance.get<NoticeDetailApiResponse>(
    GET_NOTICE_DETAIL(noticeId),
  );

  if (response.data.status === "NOT_FOUND") {
    const error = new Error(response.data.message);
    (error as any).status = response.data.status;
    throw error;
  }

  return response.data.data;
};

// 인기 공지사항 조회 api
export const getPopularNoticesApi =
  async (): Promise<NoticeListApiResponse> => {
    const response =
      await axiosInstance.get<NoticeListApiResponse>(GET_POPULAR_NOTICES);
    return response.data;
  };

// 주요 공지사항 조회 api
export const getPrimaryNoticesApi =
  async (): Promise<NoticeListApiResponse> => {
    const response =
      await axiosInstance.get<NoticeListApiResponse>(GET_PRIMARY_NOTICES);
    return response.data;
  };

// 공지사항 기타 탭 (학과 링크) 조회 api
export const getNoticeOthersApi = async (): Promise<DepartmentUrlData[]> => {
  const response =
    await axiosInstance.get<NoticeOthersResponse>(GET_NOTICE_OTHERS);
  return response.data.data;
};

// ===================== 북마크 API =====================

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

// ===================== 검색 API =====================

// 공지사항 검색 api
export const searchNoticesApi = async (params: {
  keyword: string;
  page?: number;
  size?: number;
}): Promise<NoticeListResponse> => {
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
