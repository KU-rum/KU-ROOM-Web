import { useEffect } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import useToast from "@hooks/use-toast";
import {
  getFriendRankingApi,
  getLocationMyRankApi,
  getLocationTop3RankApi,
  getLocationTotalRankApi,
  getUserSharingRankingApi,
  LocationMyRankResponse,
  LocationTop3RankResponse,
  LocationTotalRankResponseData,
  type RankingResponse,
} from "@apis/ranking";
import { RANKING_QUERY_KEY } from "@/queryKey";

// TODO: 위치 공유 취소 시 캐시 초기화. map 관련 api 리팩토링 시 추가
export const useUserSharingRankingQuery = () => {
  const toast = useToast();

  const {
    data,
    isPending: isPendingUserRankingData,
    isError,
    error,
  } = useQuery<RankingResponse>({
    queryKey: RANKING_QUERY_KEY.USER,
    queryFn: () => getUserSharingRankingApi(),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 3,
  });

  const userRankingData = data?.data;

  useEffect(() => {
    if (isError) {
      toast.error(`유저 랭킹 조회 오류 : ${error.message}`);
    }
  }, [isError, toast, error]);

  return {
    userRankingData,
    isPendingUserRankingData,
  };
};

export const useFriendSharingRankingQuery = (friendId: string) => {
  const toast = useToast();

  const {
    data,
    isPending: isPendingFriendRankingData,
    isError,
    error,
  } = useQuery<RankingResponse>({
    queryKey: RANKING_QUERY_KEY.FRIEND(friendId),
    queryFn: () => getFriendRankingApi(friendId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const friendRankingData = data?.data;

  useEffect(() => {
    if (isError) {
      toast.error(`친구 랭킹 조회 오류 : ${error.message}`);
    }
  }, [isError, toast, error]);

  return {
    friendRankingData,
    isPendingFriendRankingData,
  };
};

export const useLocationTotalRankQuery = (placeId: number) => {
  const toast = useToast();

  const { ref: listBottomRef, inView } = useInView();

  const {
    data: top3RankResponse,
    isPending: isTop3Pending,
    isError: isTop3Error,
  } = useQuery<LocationTop3RankResponse>({
    queryKey: RANKING_QUERY_KEY.LOCATION_TOP3(placeId),
    queryFn: () => getLocationTop3RankApi(placeId),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });

  const {
    data: rowTotalRankResponse,
    isPending: isTotalRankPending,
    isError: isTotalRankError,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<LocationTotalRankResponseData>({
    queryKey: RANKING_QUERY_KEY.LOCATION_TOTAL(placeId),
    initialPageParam: null,
    queryFn: async ({ pageParam }) => {
      const lastKnown = pageParam === null ? undefined : String(pageParam);
      const response = await getLocationTotalRankApi(placeId, lastKnown);
      return response;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage?.hasNext && lastPage.nextCursor !== undefined) {
        return lastPage.nextCursor;
      }
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });

  const {
    data: myRankResponse,
    isPending: isMyRankPending,
    isError: isMyRankError,
  } = useQuery<LocationMyRankResponse>({
    queryKey: RANKING_QUERY_KEY.LOCATION_USER(placeId),
    queryFn: () => getLocationMyRankApi(placeId),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });

  const top3RankData = top3RankResponse?.data;
  const totalRankData =
    rowTotalRankResponse?.pages.flatMap((page) => page?.ranks || []) || [];
  const myRankData = myRankResponse?.data;

  const isPagePending = isTop3Pending || isTotalRankPending || isMyRankPending;

  useEffect(() => {
    if (isTop3Error || isTotalRankError || isMyRankError) {
      toast.error("페이지 조회 중 오류가 발생했습니다.");
    }
  }, [isTop3Error, isTotalRankError, isMyRankError, toast]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return {
    listBottomRef,
    top3RankData,
    myRankData,
    totalRankData,
    isPagePending,
    isTop3Pending,
    isTotalRankPending,
    isMyRankPending,
  };
};
