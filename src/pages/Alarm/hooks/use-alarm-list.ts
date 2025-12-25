import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { AlarmListResponseData, getAlarmListApi } from "@pages/Alarm/api";
import { ALARM_QUERY_KEY } from "@pages/Alarm/querykey/alarm";
import useToast from "@/shared/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useAlarmList = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const { ref: listBottomRef, inView } = useInView();

  const {
    data: rowAlarmDatas,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<AlarmListResponseData>({
    queryKey: ALARM_QUERY_KEY.ALARM_LIST,
    initialPageParam: null,
    queryFn: async ({ pageParam }) => {
      const lastKnown = pageParam === null ? undefined : String(pageParam);
      const response = await getAlarmListApi(lastKnown);
      return response;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage?.hasNext && lastPage.nextCursor !== undefined) {
        return lastPage.nextCursor;
      }
    },
    retry: 1,
  });

  const alarmList =
    rowAlarmDatas?.pages.flatMap((page) => page?.alarms || []) || [];

  const unreadAlarmList = alarmList.filter((alarm) => alarm.isChecked !== true);

  if (isError) {
    toast.error(error.message);
    navigate("/");
  }

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return {
    listBottomRef,
    alarmList,
    unreadAlarmList,
    isPending,
  };
};
