// 친구 관련 api
import axiosInstance from "./axiosInstance"; // axiosInstance import

const GET_ALL_FRIENDS = "/friends/list";

// 친구 목록 조회 api
interface GetAllFriendsResponse {
  code: number;
  status: string;
  message: string;
  data: { id: number; nickname: string; profileImg: string }[];
}

export const getAllFriends = async () => {
  try {
    const response =
      await axiosInstance.get<GetAllFriendsResponse>(GET_ALL_FRIENDS);
    return response.data.data;
  } catch (error: any) {
    console.error("단과대 조회 실패:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "단과대 조회 중 오류 발생"
    );
  }
};
