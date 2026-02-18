import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import useToast from "@hooks/use-toast";
import {
  AlarmListResponseData,
  AlarmReadStatusResponse,
  CheckAlarmRequest,
} from "@apis/types";
import {
  checkAlarmApi,
  checkAllAlarmsApi,
  getAlarmActiveStatusApi,
  getAlarmListApi,
  getAlarmUnreadStatusApi,
  updateAlarmActiveStatusApi,
} from "@apis/alarm";
import { ALARM_QUERY_KEY } from "@/queryKey";

export const useAlarmListQuery = () => {
  const toast = useToast();

  const { ref: listBottomRef, inView } = useInView();

  const {
    data: rowAlarmDatas,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<AlarmListResponseData>({
    queryKey: ALARM_QUERY_KEY.LIST,
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

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error, toast]);

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

export const useCheckAlarmMutation = () => {
  const toast = useToast();
  const qc = useQueryClient();
  const { mutate: checkAlarm } = useMutation({
    mutationFn: (params: CheckAlarmRequest) => checkAlarmApi(params),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ALARM_QUERY_KEY.LIST,
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: checkAllAlarms } = useMutation({
    mutationFn: () => checkAllAlarmsApi(),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ALARM_QUERY_KEY.LIST,
      });
      toast.info("모두 읽음 처리되었습니다.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { checkAlarm, checkAllAlarms };
};

export const useUnreadAlarmQuery = () => {
  const { data } = useQuery<AlarmReadStatusResponse>({
    queryKey: ALARM_QUERY_KEY.UNREAD_STATUS,
    queryFn: () => getAlarmUnreadStatusApi(),
  });

  const unreadAlarmData = data?.data;

  return { unreadAlarmData };
};

export const useAlarmSettingsQuery = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const {
    data,
    isPending: isPendingAlarmActiveStatus,
    isError,
  } = useQuery({
    queryKey: ALARM_QUERY_KEY.SETTINGS,
    queryFn: () => getAlarmActiveStatusApi(),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (isError) {
      toast.error("알림 설정 조회 실패. 다시 시도해주세요.");
      navigate("/myinfo");
    }
  }, [isError, toast, navigate]);

  const disabledAlarmTypes = data?.data.disabledAlarmType;

  return {
    disabledAlarmTypes,
    isPendingAlarmActiveStatus,
  };
};

export const useAlarmSettingsMutation = () => {
  const toast = useToast();
  const qc = useQueryClient();
  const { mutate: updateAlarmActiveStatus } = useMutation({
    mutationFn: (alarmTypes: string[]) =>
      updateAlarmActiveStatusApi(alarmTypes),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ALARM_QUERY_KEY.SETTINGS,
      });
    },
    onError: () => {
      toast.error("알림 설정 변경을 실패했습니다.");
    },
  });

  return {
    updateAlarmActiveStatus,
  };
};
