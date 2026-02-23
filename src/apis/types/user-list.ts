import { ApiResponse } from ".";

export interface SearchedUserData {
  userId: number;
  nickname: string;
  imageUrl: string;
  requestSent: boolean;
  requestReceived: boolean;
  isFriend: boolean;
}

export interface SearchedUserListResponse extends ApiResponse {
  data: SearchedUserData[];
}

export interface FriendRequestReceivedData {
  requestId: number;
  fromUserId: number;
  fromUserNickname: string;
  imageUrl: string;
}

export interface GetFriendRequestReceivedListResponse extends ApiResponse {
  data: FriendRequestReceivedData[];
}
