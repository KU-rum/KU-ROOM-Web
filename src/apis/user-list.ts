import axiosInstance from "./axiosInstance";
import { ApiResponse } from "@/shared/types";

const SEARCH_NEW_FRIENDS = "/friends/search";
const REQUEST_FRIEND = "/friends/request";
const GET_SENT_REQUESTS = "/friends/requests/sent";
const GET_RECEIVED_REQUESTS = "/friends/requests/received";
const ACCEPT_REQUEST = "/friends/accept";
const REJECT_REQUEST = "/friends/reject";

export interface SearchedUserData {
  userId: number;
  nickname: string;
  imageUrl: string;
  requestSent: boolean;
  requestReceived: boolean;
  isFriend: boolean;
}

// 친구 요청할 닉네임 검색 api
export interface SearchedUserListResponse extends ApiResponse {
  data: SearchedUserData[];
}
export const getSearchedUserListApi = async (nickname: string) => {
  const response = await axiosInstance.get<SearchedUserListResponse>(
    SEARCH_NEW_FRIENDS,
    {
      params: {
        nickname,
      },
    },
  );

  return response.data;
};

export interface FriendRequestReceivedData {
  requestId: number;
  fromUserId: number;
  fromUserNickname: string;
  imageUrl: string;
}

// 보낸 요청 목록 조회 api
export interface GetFriendRequestReceivedListResponse extends ApiResponse {
  data: FriendRequestReceivedData[];
}
export const getSentRequestListApi = async () => {
  const response =
    await axiosInstance.get<GetFriendRequestReceivedListResponse>(
      GET_SENT_REQUESTS,
    );
  return response.data;
};

// 받은 요청 목록 조회 api
export const getReceivedRequestListApi = async () => {
  const response =
    await axiosInstance.get<GetFriendRequestReceivedListResponse>(
      GET_RECEIVED_REQUESTS,
    );
  return response.data;
};

// 친구 요청 api
export const requestFriendApi = async (receiverId: number) => {
  const response = await axiosInstance.post<ApiResponse>(REQUEST_FRIEND, {
    receiverId: receiverId,
  });
  return response.data;
};

// 보낸 요청 취소 api
export const cancelRequestApi = async (receiverId: number) => {
  const response = await axiosInstance.delete<ApiResponse>(REQUEST_FRIEND, {
    data: { receiverId },
  });

  return response.data;
};

// 친구 요청 수락 api
export const acceptRequestApi = async (receiverId: number) => {
  const response = await axiosInstance.put<ApiResponse>(ACCEPT_REQUEST, {
    receiverId: receiverId,
  });
  return response.data;
};

// 친구 요청 거절 api
export const rejectRequestApi = async (receiverId: number) => {
  const response = await axiosInstance.put<ApiResponse>(REJECT_REQUEST, {
    receiverId,
  });
  return response.data;
};
