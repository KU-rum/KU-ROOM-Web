// 랭킹 관련 api
import axiosInstance from "./axiosInstance";
import { PAGE_SIZE } from "@constant/page";
import {
  LocationMyRankResponse,
  LocationTop3RankResponse,
  LocationTotalRankResponse,
  RankingResponse,
} from "./types";

const GET_USER_SHARING_RANKING = "/places/users/ranks";
const FRIEND_RANKING = (friendId: string) => `/places/users/${friendId}/ranks`;
const LOCATION_RANK_URL = {
  TOP3: (placeId?: number) => `/places/${placeId}/top`,
  TOTAL: (placeId?: number) => `/places/${placeId}/ranks`,
  ME: (placeId?: number) => `/places/${placeId}/ranks/me`,
};

// 유저의 내 장소 랭킹 조회 api
export const getUserSharingRankingApi = async () => {
  const response = await axiosInstance.get<RankingResponse>(
    GET_USER_SHARING_RANKING,
  );
  return response.data;
};

// 친구의 내 장소 랭킹 조회 api
export const getFriendRankingApi = async (friendId: string) => {
  const response = await axiosInstance.get<RankingResponse>(
    FRIEND_RANKING(friendId),
  );

  return response.data;
};

// 위치별 top3 조회 api
export const getLocationTop3RankApi = async (placeId?: number) => {
  if (!placeId) throw Error("위치 상위 랭킹 조회 불가");

  const response = await axiosInstance.get<LocationTop3RankResponse>(
    LOCATION_RANK_URL.TOP3(placeId),
  );

  return response.data;
};

// 위치별 랭킹 조회 무한스크롤 api
export const getLocationTotalRankApi = async (
  placeId?: number,
  lastKnown?: string,
) => {
  if (!placeId) throw Error("위치 랭킹 조회 불가");
  const response = await axiosInstance.get<LocationTotalRankResponse>(
    LOCATION_RANK_URL.TOTAL(placeId),
    { params: { lastKnown, limit: PAGE_SIZE } },
  );

  return response.data.data;
};

// 위치별 내 랭킹 조회 api
export const getLocationMyRankApi = async (placeId?: number) => {
  if (!placeId) throw Error("위치 유저 랭킹 조회 불가");
  const response = await axiosInstance.get<LocationMyRankResponse>(
    LOCATION_RANK_URL.ME(placeId),
  );

  return response.data;
};
