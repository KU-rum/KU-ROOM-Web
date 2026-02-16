// 랭킹 관련 api
import { PAGE_SIZE } from "@/shared/constant/page";
import axiosInstance from "./axiosInstance";

import { ApiResponse } from "@/shared/types";

const GET_USER_SHARING_RANKING = "/places/users/ranks";
const FRIEND_RANKING = (friendId: string) => `/places/users/${friendId}/ranks`;
const LOCATION_RANK_URL = {
  TOP3: (placeId: number) => `/places/${placeId}/top`,
  TOTAL: (placeId: number) => `/places/${placeId}/ranks`,
  ME: (placeId: number) => `/places/${placeId}/ranks/me`,
};

export interface RankListType {
  name: string[];
  sharingCount: number;
}

export interface LocationTop3RankType {
  ranking: number;
  nickname: string[];
  sharingCount: number;
}

export interface LocationTotalRankType {
  ranking: number;
  nickname: string;
  sharingCount: number;
}

export interface RankingResponse extends ApiResponse {
  data: RankListType[];
}

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

// 위치별 top3  조회
export interface LocationTop3RankResponse extends ApiResponse {
  data: LocationTop3RankType[];
}

export const getLocationTop3RankApi = async (placeId: number) => {
  const response = await axiosInstance.get<LocationTop3RankResponse>(
    LOCATION_RANK_URL.TOP3(placeId),
  );

  return response.data;
};

export interface LocationTotalRankResponseData {
  ranks: LocationTotalRankType[];
  hasNext: boolean;
  nextCursor: string;
}
export interface LocationTotalRankResponse extends ApiResponse {
  data: LocationTotalRankResponseData;
}

// 위치별 랭킹 조회 무한스크롤
export const getLocationTotalRankApi = async (
  placeId: number,
  lastKnown?: string,
) => {
  const response = await axiosInstance.get<LocationTotalRankResponse>(
    LOCATION_RANK_URL.TOTAL(placeId),
    { params: { lastKnown, limit: PAGE_SIZE } },
  );

  return response.data.data;
};

export interface LocationMyRankResponse extends ApiResponse {
  data: LocationTotalRankType;
}

// 위치별 내 랭킹 조회
export const getLocationMyRankApi = async (placeId: number) => {
  const response = await axiosInstance.get<LocationMyRankResponse>(
    LOCATION_RANK_URL.ME(placeId),
  );

  return response.data;
};
