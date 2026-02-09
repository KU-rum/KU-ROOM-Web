import { useQuery } from "@tanstack/react-query";

import { getFriendRankingData } from "@apis/friend";
import useToast from "@hooks/use-toast";

import { RANKING_QUERY_KEY } from "@/queryKey";
import { RankListType } from "@/shared/types";

export default function useFriendRanking(friendId: string) {
  const toast = useToast();

  const {
    data: friendRankingData,
    isPending,
    isError,
  } = useQuery<RankListType[]>({
    queryKey: RANKING_QUERY_KEY.FRIEND(friendId),
    queryFn: () => getFriendRankingData(friendId),
    staleTime: 1000 * 60 * 3,
    enabled: !!friendId,
  });

  if (isError) {
    toast.error("친구 랭킹 조회에 실패했습니다.");
  }

  return {
    friendRankingData,
    isPending,
  };
}
