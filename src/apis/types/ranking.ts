import { ApiResponse } from ".";

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

export interface LocationTop3RankResponse extends ApiResponse {
  data: LocationTop3RankType[];
}

export interface LocationTotalRankResponseData {
  ranks: LocationTotalRankType[];
  hasNext: boolean;
  nextCursor?: string;
}
export interface LocationTotalRankResponse extends ApiResponse {
  data: LocationTotalRankResponseData;
}

export interface LocationMyRankResponse extends ApiResponse {
  data: LocationTotalRankType;
}
