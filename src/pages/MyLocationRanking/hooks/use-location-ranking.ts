import { useQuery } from "@tanstack/react-query";

import { getAllFriends } from "@apis/friend";
import { getSharingRanking } from "@apis/home";
import useToast from "@hooks/use-toast";
import { FRIEND_QUERY_KEY, RANKING_QUERY_KEY } from "@/queryKey";

export default function useLocationRanking() {
  const toast = useToast();

  const {
    data: userRankingData,
    isPending: isPendingUserRanking,
    isError: isErrorUserRanking,
  } = useQuery({
    queryKey: RANKING_QUERY_KEY.USER,
    queryFn: () => getSharingRanking(),
    staleTime: 1000 * 60 * 3,
  });

  const {
    data: friendListData,
    isPending: isPendingFriend,
    isError: isErrorFriend,
  } = useQuery({
    queryKey: FRIEND_QUERY_KEY.LIST,
    queryFn: () => getAllFriends(),
    staleTime: 1000 * 60 * 3,
  });

  const isError = isErrorUserRanking || isErrorFriend;
  if (isError) {
    toast.error("페이지 조회에 실패했습니다. 다시 시도해주세요.");
  }

  return {
    userRankingData,
    friendListData,
    isPendingUserRanking,
    isPendingFriend,
  };
}
