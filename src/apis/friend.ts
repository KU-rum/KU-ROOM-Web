// 친구 관련 api
import axiosInstance from "./axiosInstance"; // axiosInstance import

const GET_ALL_FRIENDS = "/friends/list";
const SEARCH_NEW_FRIENDS = "/friends/search?nickname=";
const REQUEST_FRIEND = "/friends/request";
const GET_SENT_REQUESTS = "/friends/requests/sent";
const GET_RECEIVED_REQUESTS = "/friends/requests/received";
const ACCEPT_REQUEST = "/friends/accept";
const REJECT_REQUEST = "/friends/reject";
const DELETE_FRIEND = "/friends/";
const BLOCK_FRIEND = "/friends/block";
const REPORT_FRIEND = "/friends/report";

interface DefaultResponse {
  code: number;
  status: string;
  message: string;
}

// 친구 목록 조회 api
interface GetAllFriendsResponse {
  code: number;
  status: string;
  message: string;
  data: { id: number; nickname: string; imageUrl: string }[];
}

export const getAllFriends = async () => {
  try {
    const response =
      await axiosInstance.get<GetAllFriendsResponse>(GET_ALL_FRIENDS);
    console.log(response);
    return response.data.data;
  } catch (error: any) {
    console.error(
      "친구 목록 조회 실패:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "친구 목록 조회 중 오류 발생"
    );
  }
};
// 친구 요청할 친구 닉네임 검색 api
interface NewFriendsSearchResponse {
  code: number;
  status: string;
  message: string;
  data: {
    userId: number;
    nickname: string;
    imageUrl: string;
    requestSent: boolean;
    isFriend: boolean;
  }[];
}
export const getSearchedNewFriends = async (nickname: string) => {
  try {
    const response = await axiosInstance.get<NewFriendsSearchResponse>(
      SEARCH_NEW_FRIENDS + nickname
    );
    console.log(response.data.data);
    return response.data.data;
  } catch (error: any) {
    console.error(
      "추가할 친구 닉네임 검색 실패:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "추가할 친구 닉네임 검색 중 오류 발생"
    );
  }
};
// 친구 요청 api
export const requestFriend = async (receivedId: number) => {
  try {
    const response = await axiosInstance.post<DefaultResponse>(REQUEST_FRIEND, {
      receivedId: receivedId,
    });
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

// 보낸 요청 목록 조회 api
interface GetRequests {
  code: number;
  status: string;
  message: string;
  data: {
    requestId: number;
    fromUserId: number;
    fromUserNickname: string;
    imageUrl: string;
  }[];
}
export const getSentRequests = async () => {
  try {
    const response = await axiosInstance.get<GetRequests>(GET_SENT_REQUESTS);
    console.log("보낸 요청: ", response.data);
    return response.data.data;
  } catch (error: any) {
    console.error(
      "보낸 요청 조회 실패:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "보낸 요청 조회 중 오류 발생"
    );
  }
};
// 받은 요청 목록 조회 api
export const getReceivedRequests = async () => {
  try {
    const response = await axiosInstance.get<GetRequests>(
      GET_RECEIVED_REQUESTS
    );
    console.log("받은 요청: ", response.data);
    return response.data.data;
  } catch (error: any) {
    console.error(
      "받은 요청 조회 실패:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "받은 요청 조회 중 오류 발생"
    );
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
      }
    );
    console.log("요청 수락 결과 : ", response.data);
    return response.data;
  } catch (error: any) {
    console.error("요청 수락 실패:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "요청 수락 중 오류 발생");
  }
};
// 친구 요청 거절 api
export const rejectRequest = async (requestId: number) => {
  try {
    const response = await axiosInstance.put(
      REJECT_REQUEST,
      {
        requestId: requestId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("요청 거절 결과 : ", response.data);
    return response.data;
  } catch (error: any) {
    console.error("요청 거절 실패:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "요청 거절 중 오류 발생");
  }
};

// 보낸 요청 취소 api
export const cancelRequest = async (requestId: number) => {
  try {
    // delete 요청에 body가 필요할 때 아래와 같이 사용한다.
    const response = await axiosInstance.request({
      url: REQUEST_FRIEND,
      method: "DELETE",
      data: { requestId },
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("요청 취소 결과 : ", response.data);
    return response.data;
  } catch (error: any) {
    console.error("요청 취소 실패:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "요청 취소 중 오류 발생");
  }
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
      }
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
      }
    );
    console.log("친구 신고 결과 : ", response.data);
    return response.data;
  } catch (error: any) {
    console.error("친구 신고 실패:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "친구 신고 중 오류 발생");
  }
};
