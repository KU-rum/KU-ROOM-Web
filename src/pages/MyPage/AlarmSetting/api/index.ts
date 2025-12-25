import axiosInstance from "@apis/axiosInstance";
import { ApiResponse } from "@/shared/types";

const ALARM_SETTING_API_URL = {
  ALARM_ACTIVE_STATUS: "/alarm/disable",
};

interface GetAlarmActiveStatusResponse extends ApiResponse {
  data: {
    disabledAlarmType: string[];
  };
}

export const getAlarmActiveStatusApi = async () => {
  const response = await axiosInstance.get<GetAlarmActiveStatusResponse>(
    ALARM_SETTING_API_URL.ALARM_ACTIVE_STATUS
  );

  return response.data.data.disabledAlarmType;
};

interface UpdateAlarmActiveStatusResponse extends ApiResponse {
  data: {
    disabledAlarmType: string[];
  };
}

export const updateAlarmActiveStatusApi = async (alarmType: string) => {
  const response = await axiosInstance.patch<UpdateAlarmActiveStatusResponse>(
    ALARM_SETTING_API_URL.ALARM_ACTIVE_STATUS,
    {
      alarmType,
    }
  );

  return response.data.data;
};

// TODO : 전체 알림 활성화 및 비활성화 api 필요
