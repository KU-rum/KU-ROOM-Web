import { useQuery } from "@tanstack/react-query";

import { getSharingRanking } from "@apis/home";
import useToast from "@hooks/use-toast";
import { RANKING_QUERY_KEY } from "@/queryKey";
import { useFriendListQuery } from "@/queries";

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

  const { friendListData, isPendingFriendList, isErrorFriendList } =
    useFriendListQuery();

  const isError = isErrorUserRanking || isErrorFriendList;
  if (isError) {
    toast.error("페이지 조회에 실패했습니다. 다시 시도해주세요.");
  }

  return {
    userRankingData,
    friendListData,
    isPendingUserRanking,
    isPendingFriendList,
  };
}
