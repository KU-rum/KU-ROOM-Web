import axiosInstance from "./axiosInstance";
import { ApiResponse } from "@/shared/types";

const SEARCH_NEW_FRIENDS = "/friends/search?nickname=";
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
    SEARCH_NEW_FRIENDS + nickname,
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
export const getSentRequestList = async () => {
  const response =
    await axiosInstance.get<GetFriendRequestReceivedListResponse>(
      GET_SENT_REQUESTS,
    );
  return response.data;
};

// 받은 요청 목록 조회 api
export const getReceivedRequestList = async () => {
  const response =
    await axiosInstance.get<GetFriendRequestReceivedListResponse>(
      GET_RECEIVED_REQUESTS,
    );
  return response.data;
};

// ------------------- 완료선 -----------------------

// 친구 요청 api
export const requestFriend = async (receiverId: number) => {
  try {
    const response = await axiosInstance.post<ApiResponse>(
      REQUEST_FRIEND,
      {
        receiverId: receiverId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (response.data.code === 304) {
      throw response.data;
    } else {
      return response.data;
    }
  } catch (error: any) {
    console.error("친구 요청 실패:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "친구 요청 중 오류 발생");
  }
};

// 친구 요청 수락 api
export const acceptRequest = async (receiverId: number) => {
  try {
    const response = await axiosInstance.put(
      ACCEPT_REQUEST,
      {
        receiverId: receiverId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log("요청 수락 결과 : ", response.data);
    return response.data;
  } catch (error: any) {
    console.error("요청 수락 실패:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "요청 수락 중 오류 발생");
  }
};
// 친구 요청 거절 api
export const rejectRequest = async (receiverId: number) => {
  try {
    const response = await axiosInstance.put(
      REJECT_REQUEST,
      {
        receiverId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log("요청 거절 결과 : ", response.data);
    return response.data;
  } catch (error: any) {
    console.error("요청 거절 실패:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "요청 거절 중 오류 발생");
  }
};

// 보낸 요청 취소 api
export const cancelRequest = async (receiverId: number) => {
  try {
    // delete 요청에 body가 필요할 때 아래와 같이 사용한다.
    const response = await axiosInstance.request({
      url: REQUEST_FRIEND,
      method: "DELETE",
      data: { receiverId },
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("요청 취소 결과 : ", response);
    return response.data;
  } catch (error: any) {
    console.error("요청 취소 실패:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "요청 취소 중 오류 발생");
  }
};
