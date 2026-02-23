// tanstack query 리팩토링 완료
// 친구 관련 api
import axiosInstance from "./axiosInstance";
import { ApiResponse, GetUserFriendListResponse } from "./types";

const GET_ALL_FRIENDS = "/friends/list";
const DELETE_FRIEND = "/friends/";
const BLOCK_FRIEND = "/friends/block";
const REPORT_FRIEND = "/friends/report";

// 친구 목록 조회 api
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
  const response = await axiosInstance.patch<ApiResponse>(BLOCK_FRIEND, {
    reportId: reportId,
  });
  return response.data;
};

// 친구 신고 api
export const friendReportApi = async (reportId: number, reason: string) => {
  const response = await axiosInstance.patch<ApiResponse>(REPORT_FRIEND, {
    reportId: reportId,
    reason: reason,
  });
  return response.data;
};
