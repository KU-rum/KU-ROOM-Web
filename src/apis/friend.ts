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
export const friendDelete = async (friendId: string) => {
  try {
    const response = await axiosInstance.delete(DELETE_FRIEND + friendId, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("친구 삭제 결과 : ", response.data);
    return response.data;
  } catch (error: any) {
    console.error("친구 삭제 실패:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "친구 삭제 중 오류 발생");
  }
};

// 친구 차단 api
export const friendBlock = async (reportId: number) => {
  try {
    const response = await axiosInstance.patch(
      BLOCK_FRIEND,
      {
        reportId: reportId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log("친구 차단 결과 : ", response.data);
    return response.data;
  } catch (error: any) {
    console.error("친구 차단 실패:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "친구 차단 중 오류 발생");
  }
};
// 친구 신고 api
export const friendReport = async (reportId: number, reason: string) => {
  try {
    const response = await axiosInstance.patch(
      REPORT_FRIEND,
      {
        reportId: reportId,
        reason: reason,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log("친구 신고 결과 : ", response.data);
    return response.data;
  } catch (error: any) {
    console.error("친구 신고 실패:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "친구 신고 중 오류 발생");
  }
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
