import { useMutation, useQueryClient } from "@tanstack/react-query";
import useToast from "@hooks/use-toast";
import { updateAlarmActiveStatusApi } from "../api";
import { ALARM_QUERY_KEY } from "@/pages/Alarm/querykey/alarm";

export default function useAlarmSettingMutation() {
  const toast = useToast();
  const qc = useQueryClient();
  const { mutate: updateAlarmActiveStatus } = useMutation({
    mutationFn: (alarmType: string) => updateAlarmActiveStatusApi(alarmType),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ALARM_QUERY_KEY.SETTING,
      });
      toast.info("알림 설정이 변경되었습니다.");
    },
    onError: () => {
      toast.error("알림 설정 변경을 실패했습니다.");
    },
  });

  return {
    updateAlarmActiveStatus,
  };
}
