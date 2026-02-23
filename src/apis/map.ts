// 지도 관련 api
import axiosInstance from "./axiosInstance";
import {
  ApiResponse,
  CategoryEnum,
  CategoryLocationsResponse,
  Coordinate,
  LocationDetailResponse,
  MapRecentSearchResponse,
  MapSearchResultResponse,
  PlaceNameResponse,
  ShareStatusResponse,
} from "./types";

const CHECK_SHARE_STATE_API = "/places/sharing/status";
const GET_LOCATION_NAME = "/places/sharing";
const SHARE_USER_LOCATION = "/places/sharing/confirm";
const UNSHARE_LOCATION = "/places/sharing/confirm";
const GET_CHIP_LOCATION = "/places";
const GET_LOCATION_DETAIL_DATA = (placeId: number) => `/places/${placeId}`;
const GET_SEARCH_LOCATION_RESULT = "/places/search";
const SAVE_SEARCH_LOCATION_KEYWORD = "/places/search/keyword";
const GET_RECENT_SEARCH = "/places/search/history"; // 최근 검색어 5개
const DELETE_RECENT_ALL_SEARCH = "/places/search/history"; // 최근 검색어 모두 삭제
const DELETE_RECENT_SEARCH = (deleteData: number) =>
  `/places/search/history/${deleteData}`; // 최근 검색어 하나 삭제

// 위치 공유 상태 조회 api
export const checkShareStatusApi = async () => {
  const response = await axiosInstance.get<ShareStatusResponse>(
    CHECK_SHARE_STATE_API,
  );
  return response.data;
};

// 좌표 기준 건물명 받아오는 api
export const getLocationNameApi = async (coord?: Coordinate) => {
  const response = await axiosInstance.post<PlaceNameResponse>(
    GET_LOCATION_NAME,
    coord,
  );
  return response.data;
};

// 위치 공유 시작 api
export const shareUserLocationApi = async (placeName: string) => {
  const response = await axiosInstance.post<PlaceNameResponse>(
    SHARE_USER_LOCATION,
    {
      placeName: placeName,
    },
  );
  return response.data; // 성공 응답 반환
};

// 위치 공유 해제 api
export const unshareLocationApi = async () => {
  const response =
    await axiosInstance.delete<ShareStatusResponse>(UNSHARE_LOCATION);
  return response.data;
};

// 위치 검색 시 검색 결과(타이틀) api.
export const getMapSearchResultApi = async (search: string) => {
  const response = await axiosInstance.get<MapSearchResultResponse>(
    GET_SEARCH_LOCATION_RESULT,
    { params: { query: search.trim() } },
  );
  return response.data;
};

// 최근 위치 검색어 가져오기 api
export const getMapRecentSearchApi = async () => {
  const response =
    await axiosInstance.get<MapRecentSearchResponse>(GET_RECENT_SEARCH);

  return response.data;
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
  });
  return response.data;
};

// 최근 검색어 하나 삭제 api
export const deleteMapRecentSearchApi = async (deleteData: number) => {
  const response = await axiosInstance.request({
    url: DELETE_RECENT_SEARCH(deleteData),
    method: "DELETE",
  });
  return response.data;
};

// 카테고리 칩(핀) 클릭 시 위치 정보 조회 api / 홈에서 친구 위치 조회에서도 사용
export const getCategoryLocationsApi = async (category: CategoryEnum) => {
  const response = await axiosInstance.get<CategoryLocationsResponse>(
    GET_CHIP_LOCATION,
    { params: { chip: category.trim() } },
  );

  return response.data;
};

// 하나의 위치에 대한 디테일 정보 조회 api
export const getLocationDetailDataApi = async (placeId?: number) => {
  if (!placeId) throw Error("위치 상세정보 조회 불가");
  const response = await axiosInstance.get<LocationDetailResponse>(
    GET_LOCATION_DETAIL_DATA(placeId),
  );
  return response.data;
};
