// 지도 관련 api
import axiosInstance from "./axiosInstance";

import {
  DetailPlaceData,
  MapRecentSearchData,
  MapSearchResult,
  PlaceData,
} from "@/shared/types";

import { ApiResponse } from "./types";

const CHECK_SHARE_STATE_API = "/places/sharing/status";
const GET_USER_SHARE_LOCATION = "/places/sharing";
const SHARE_USER_LOCATION = "/places/sharing/confirm";
const UNSHARE_LOCATION = "/places/sharing/confirm";
const GET_CHIP_LOCATION = "/places";
const GET_LOCATION_DETAIL_DATA = "/places/";
const GET_SEARCH_LOCATION_RESULT = "/places/search";
const SAVE_SEARCH_LOCATION_KEYWORD = "/places/search/keyword";
const GET_RECENT_SEARCH = "/places/search/history"; // 최근 검색어 5개
const DELETE_RECENT_ALL_SEARCH = "/places/search/history"; // 최근 검색어 모두 삭제
const DELETE_RECENT_SEARCH = "/places/search/history/"; // 최근 검색어 하나 삭제

// 현재 위치 공유 상태인지 여부 api
interface IsSharedApiResponse extends ApiResponse {
  data: {
    isActive: boolean;
    placeName: string | null;
  };
}
export const checkIsSharedApi = async () => {
  try {
    const response = await axiosInstance.get<IsSharedApiResponse>(
      CHECK_SHARE_STATE_API,
    );
    return response.data.data; // 성공 응답 반환
  } catch (error: any) {
    console.error(
      "위치 공유 상태 확인 실패:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || "위치 공유 상태 확인 중 오류 발생",
    );
  }
};

// 내 위치 공유 클릭 시 가장 가까운 건물명 받아오는 api
interface GetUserShareLocationApi extends ApiResponse {
  data: {
    placeName: string;
  };
}
export const getUserShareLocation = async (
  latitude: number,
  longitude: number,
) => {
  try {
    const response = await axiosInstance.post<GetUserShareLocationApi>(
      GET_USER_SHARE_LOCATION,
      {
        latitude: latitude,
        longitude: longitude,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data; // 성공 응답 반환
  } catch (error: any) {
    console.error(
      "유저의 가장 가까운 건물명 조회 실패:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message ||
        "유저의 가장 가까운 건물명 조회 중 오류 발생",
    );
  }
};

// 위치 공유 시작(확정) api
interface ShareUserLocationApi extends ApiResponse {
  data: {
    placeName: string;
  };
}
export const shareUserLocation = async (placeName: string) => {
  try {
    const response = await axiosInstance.post<ShareUserLocationApi>(
      SHARE_USER_LOCATION,
      {
        placeName: placeName,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data.data; // 성공 응답 반환
  } catch (error: any) {
    console.error(
      "유저의 위치 공유 실패:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || "유저의 위치 공유 중 오류 발생",
    );
  }
};

// 위치 공유 해제(취소) api
export const unshareLocation = async () => {
  try {
    const response =
      await axiosInstance.delete<IsSharedApiResponse>(UNSHARE_LOCATION);
    return response.data.status; // 성공 응답 반환
  } catch (error: any) {
    console.error(
      "위치 공유 해제 실패:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || "위치 공유 해제 중 오류 발생",
    );
  }
};

// 카테고리 칩(핀) 클릭 시 위치 정보 조회 api / 홈에서 친구 위치 조회에서도 사용
interface LocationChipApiResponse extends ApiResponse {
  data: PlaceData[];
}
export const getCategoryLocationsApi = async (category: string) => {
  try {
    const response = await axiosInstance.get<LocationChipApiResponse>(
      GET_CHIP_LOCATION,
      { params: { chip: category.trim() } },
    );

    return response.data.data; // 성공 응답 반환
  } catch (error: any) {
    console.error(
      "위치 카테고리 데이터 조회 실패:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || "위치 카테고리 데이터 조회 중 오류 발생",
    );
  }
};

// 하나의 위치에 대한 디테일 정보 조회 api
interface GetLocationDetailData extends ApiResponse {
  data: DetailPlaceData;
}
export const getLocationDetailData = async (placeId: number) => {
  try {
    const response = await axiosInstance.get<GetLocationDetailData>(
      GET_LOCATION_DETAIL_DATA + placeId,
    );
    return response.data.data; // 성공 응답 반환
  } catch (error: any) {
    console.error(
      "하나의 위치에 대한 디테일 정보 조회 실패:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message ||
        "하나의 위치에 대한 디테일 정보 조회 중 오류 발생",
    );
  }
};

// 위치 검색 시 결과 api. 타이틀만 반환
interface SearchResultApiResponse extends ApiResponse {
  data: MapSearchResult[];
}
export const getSearchLocationResult = async (search: string) => {
  const response = await axiosInstance.get<SearchResultApiResponse>(
    GET_SEARCH_LOCATION_RESULT,
    { params: { query: search.trim() } },
  );
  return response.data.data;
};

// 최근 위치 검색어 가져오기 api
interface RecentSearchReponse extends ApiResponse {
  data: MapRecentSearchData[];
}
export const getRecentSearchLocation = async () => {
  const response =
    await axiosInstance.get<RecentSearchReponse>(GET_RECENT_SEARCH);

  return response.data.data;
};

// 최근 위치 검색어 저장 api
export const saveSearchLocationKeywordApi = async (search: string) => {
  const response = await axiosInstance.post<ApiResponse>(
    SAVE_SEARCH_LOCATION_KEYWORD,
    {},
    { params: { query: search.trim() } },
  );
  return response.data;
};

// 최근 검색어 모두 삭제 api
export const deleteAllRecentData = async () => {
  const response = await axiosInstance.request({
    url: DELETE_RECENT_ALL_SEARCH,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// 최근 검색어 하나 삭제 api
export const deleteRecentSearchLocation = async (deleteData: number) => {
  const response = await axiosInstance.request({
    url: DELETE_RECENT_SEARCH + deleteData,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
