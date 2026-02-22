import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import useToast from "@hooks/use-toast";
import useDebounce from "@hooks/use-debounce";
import { checkShareStatusApi, getLocationNameApi } from "@apis/map";
import {
  Coordinate,
  PlaceNameResponse,
  ShareStatusResponse,
} from "@apis/types";
import { MAP_QUERY_KEY } from "@/queryKey";

export const useCheckShareStatusQuery = () => {
  const {
    data,
    isPending: isPendingShareStatus,
    isError: isErrorShareStatus,
  } = useQuery<ShareStatusResponse>({
    queryKey: MAP_QUERY_KEY.USER_SHARE_STATUS,
    queryFn: () => checkShareStatusApi(),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });

  const isSharedLocation = data?.data.isActive;
  const sharedLocationName = data?.data.placeName;

  return {
    isSharedLocation,
    sharedLocationName,
    isPendingShareStatus,
    isErrorShareStatus,
  };
};

// 좌표가 자주 바뀔 수 있기 때문에 과도한 캐싱 이슈로 useMutation 사용
export const useGetLocationNameQuery = (coord?: Coordinate) => {
  const toast = useToast();
  const debounced = useDebounce(coord, 500);

  const {
    data,
    isPending: isPendingGetLocationName,
    isError,
  } = useQuery<PlaceNameResponse>({
    queryKey: MAP_QUERY_KEY.PLACE_NAME(debounced),
    queryFn: () => getLocationNameApi(debounced),
    enabled: !!debounced,
    staleTime: 0,
    gcTime: 1000 * 3,
    retry: 1,
  });

  useEffect(() => {
    if (isError) {
      toast.error("장소 조회 실패");
    }
  }, [toast, isError]);

  const placeName = data?.data?.placeName;

  return { placeName, isPendingGetLocationName };
};
