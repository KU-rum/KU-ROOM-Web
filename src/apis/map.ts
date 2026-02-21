// 지도 관련 api
import axiosInstance from "./axiosInstance";
import {
  ApiResponse,
  CategoryLocationsResponse,
  LocationDetailResponse,
  MapRecentSearchReponse,
  MapSearchResultResponse,
  PlaceNameResponse,
  ShareStatusResponse,
} from "./types";

const CHECK_SHARE_STATE_API = "/places/sharing/status";
const GET_PLACE_NAME = "/places/sharing";
const SHARE_USER_LOCATION = "/places/sharing/confirm";
const UNSHARE_LOCATION = "/places/sharing/confirm";
const GET_CHIP_LOCATION = "/places";
const GET_LOCATION_DETAIL_DATA = "/places/";
const GET_SEARCH_LOCATION_RESULT = "/places/search";
const SAVE_SEARCH_LOCATION_KEYWORD = "/places/search/keyword";
const GET_RECENT_SEARCH = "/places/search/history"; // 최근 검색어 5개
const DELETE_RECENT_ALL_SEARCH = "/places/search/history"; // 최근 검색어 모두 삭제
const DELETE_RECENT_SEARCH = "/places/search/history/"; // 최근 검색어 하나 삭제

// 위치 공유 상태 조회 api
export const checkShareStatusApi = async () => {
  try {
    const response = await axiosInstance.get<ShareStatusResponse>(
      CHECK_SHARE_STATE_API,
    );
    return response.data.data;
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

// 좌표 기준 건물명 받아오는 api
export const getPlaceNameApi = async (latitude: number, longitude: number) => {
  try {
    const response = await axiosInstance.post<PlaceNameResponse>(
      GET_PLACE_NAME,
      {
        latitude,
        longitude,
      },
    );
    return response.data;
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

// 위치 공유 시작 api
export const shareUserLocationApi = async (placeName: string) => {
  try {
    const response = await axiosInstance.post<PlaceNameResponse>(
      SHARE_USER_LOCATION,
      {
        placeName: placeName,
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

// 위치 공유 해제 api
export const unshareLocationApi = async () => {
  try {
    const response =
      await axiosInstance.delete<ShareStatusResponse>(UNSHARE_LOCATION);
    return response.data;
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
export const getCategoryLocationsApi = async (category: string) => {
  try {
    const response = await axiosInstance.get<CategoryLocationsResponse>(
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
export const getLocationDetailDataApi = async (placeId: number) => {
  try {
    const response = await axiosInstance.get<LocationDetailResponse>(
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

// 위치 검색 시 검색 결과(타이틀) api.
export const getMapSearchResultApi = async (search: string) => {
  const response = await axiosInstance.get<MapSearchResultResponse>(
    GET_SEARCH_LOCATION_RESULT,
    { params: { query: search.trim() } },
  );
  return response.data.data;
};

// 최근 위치 검색어 가져오기 api
export const getMapRecentSearchApi = async () => {
  const response =
    await axiosInstance.get<MapRecentSearchReponse>(GET_RECENT_SEARCH);

  return response.data.data;
};

// 최근 위치 검색어 저장 api
export const saveMapRecentSearchApi = async (search: string) => {
  const response = await axiosInstance.post<ApiResponse>(
    SAVE_SEARCH_LOCATION_KEYWORD,
    {},
    { params: { query: search.trim() } },
  );
  return response.data;
};

// 최근 검색어 모두 삭제 api
export const deleteAllMapRecentSearchApi = async () => {
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
export const deleteMapRecentSearchApi = async (deleteData: number) => {
  const response = await axiosInstance.request({
    url: DELETE_RECENT_SEARCH + deleteData,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
