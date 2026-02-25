import { ApiResponse } from ".";

interface UserFriendData {
  id: number;
  nickname: string;
  imageUrl: string;
}
export interface GetUserFriendListResponse extends ApiResponse {
  data: UserFriendData[];
}
