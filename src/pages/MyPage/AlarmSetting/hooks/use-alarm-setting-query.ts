import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useToast from "@hooks/use-toast";

import { getAlarmActiveStatusApi } from "../api";
import { ALARM_QUERY_KEY } from "@/pages/Alarm/querykey/alarm";
import { ALARM_SECTION_DATA } from "../constant/alarm";

export default function useAlarmSettingQuery() {
  const navigate = useNavigate();
  const toast = useToast();

  const { data, isPending, isError } = useQuery({
    queryKey: ALARM_QUERY_KEY.SETTING,
    queryFn: () => getAlarmActiveStatusApi(),
  });

  if (isError) {
    toast.error("기존 알림 설정을 가져오는데 실패했습니다.");
    navigate("/myinfo");
  }

  // 각 알림 상태
  const toggleStates: Record<string, boolean> = {};

  ALARM_SECTION_DATA.forEach((section) =>
    section.contents.forEach((item) => {
      toggleStates[item.name] = !data?.includes(item.category);
    })
  );

  return {
    toggleStates,
    isPending,
  };
}
