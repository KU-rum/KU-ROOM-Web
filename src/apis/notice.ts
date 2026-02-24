// tanstack query 리팩토링 완료
// 공지사항 관련 api
import axiosInstance from "./axiosInstance";
import {
  NoticeListResponse,
  NoticeListParams,
  NoticeDetailData,
  NoticeDetailApiResponse,
  NoticeListApiResponse,
  DepartmentUrlData,
  NoticeOthersResponse,
} from "./types";

export type {
  NoticeResponse,
  NoticeListResponse,
  NoticeListParams,
  NoticeDetailData,
  DepartmentUrlData,
} from "./types";

const GET_NOTICES = "/notices";
const GET_NOTICE_DETAIL = (noticeId: string) => `/notices/${noticeId}`;
const GET_POPULAR_NOTICES = "/notices/popular";
const GET_PRIMARY_NOTICES = "/notices/primary";
const GET_NOTICE_OTHERS = "/departments/url";

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
export const getPopularNoticesApi = async (): Promise<NoticeListApiResponse> => {
  const response =
    await axiosInstance.get<NoticeListApiResponse>(GET_POPULAR_NOTICES);
  return response.data;
};

// 주요 공지사항 조회 api
export const getPrimaryNoticesApi = async (): Promise<NoticeListApiResponse> => {
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
