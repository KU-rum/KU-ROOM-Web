import { useMutation, useQueryClient } from "@tanstack/react-query";
import useToast from "@hooks/use-toast";

import {
  checkAlarmApi,
  CheckAlarmParams,
  checkAllAlarmsApi,
} from "@pages/Alarm/api";
import { ALARM_QUERY_KEY } from "@pages/Alarm/querykey/alarm";

export const useCheckAlarm = () => {
  const toast = useToast();
  const qc = useQueryClient();
  const { mutate: checkAlarm } = useMutation({
    mutationFn: (params: CheckAlarmParams) => checkAlarmApi(params),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ALARM_QUERY_KEY.ALARM_LIST,
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
        queryKey: ALARM_QUERY_KEY.ALARM_LIST,
      });
      toast.info("모두 읽음 처리되었습니다.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { checkAlarm, checkAllAlarms };
};
