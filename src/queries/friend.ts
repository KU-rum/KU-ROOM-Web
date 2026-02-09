import { useQuery } from "@tanstack/react-query";

import { getFriendListApi, GetUserFriendListResponse } from "@/apis/friend";
import { FRIEND_QUERY_KEY } from "@/queryKey";

export const useFriendListQuery = () => {
  const {
    data,
    isPending: isPendingFriendList,
    isError: isErrorFriendList,
  } = useQuery<GetUserFriendListResponse>({
    queryKey: FRIEND_QUERY_KEY.FRIEND_LIST,
    queryFn: () => getFriendListApi(),
    staleTime: 1000 * 60 * 3,
  });

  const friendListData = data?.data;

  return {
    friendListData,
    isPendingFriendList,
    isErrorFriendList,
  };
};
