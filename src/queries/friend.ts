import { useQuery } from "@tanstack/react-query";

import { getAllFriends, GetAllFriendsResponse } from "@/apis/friend";
import { FRIEND_QUERY_KEY } from "@/queryKey";

export const useFriendListQuery = () => {
  const {
    data,
    isPending: isPendingFriendList,
    isError: isErrorFriendList,
  } = useQuery<GetAllFriendsResponse>({
    queryKey: FRIEND_QUERY_KEY.LIST,
    queryFn: () => getAllFriends(),
    staleTime: 1000 * 60 * 3,
  });

  const friendListData = data?.data;

  return {
    friendListData,
    isPendingFriendList,
    isErrorFriendList,
  };
};
