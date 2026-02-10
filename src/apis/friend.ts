// 친구 관련 api
import { ApiResponse, RankListType } from "@/shared/types";
import axiosInstance from "./axiosInstance";

const GET_ALL_FRIENDS = "/friends/list";
const DELETE_FRIEND = "/friends/";
const BLOCK_FRIEND = "/friends/block";
const REPORT_FRIEND = "/friends/report";
const FRIEND_RANKING = (friendId: string) => `/places/users/${friendId}/ranks`;

interface UserFriendData {
  id: number;
  nickname: string;
  imageUrl: string;
}
// 친구 목록 조회 api
export interface GetUserFriendListResponse extends ApiResponse {
  data: UserFriendData[];
}

export const getFriendListApi = async () => {
  const response =
    await axiosInstance.get<GetUserFriendListResponse>(GET_ALL_FRIENDS);
  return response.data;
};

// 친구 삭제 api
export const friendDeleteApi = async (friendId: string) => {
  const response = await axiosInstance.delete<ApiResponse>(
    DELETE_FRIEND + friendId,
  );
  return response.data;
};

// 친구 차단 api
export const friendBlockApi = async (reportId: number) => {
  const response = await axiosInstance.patch(BLOCK_FRIEND, {
    reportId: reportId,
  });
  return response.data;
};
// 친구 신고 api
export const friendReportApi = async (reportId: number, reason: string) => {
  const response = await axiosInstance.patch(REPORT_FRIEND, {
    reportId: reportId,
    reason: reason,
  });
  return response.data;
};

// 친구의 위치 랭킹 api
interface FriendRankingResponse extends ApiResponse {
  data: RankListType[];
}

export const getFriendRankingData = async (friendId: string) => {
  const response = await axiosInstance.get<FriendRankingResponse>(
    FRIEND_RANKING(friendId),
  );

  return response.data.data;
};
