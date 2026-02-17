import axiosInstance from "@apis/axiosInstance";
import { ApiResponse } from "@apis/types";

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
    ALARM_SETTING_API_URL.ALARM_ACTIVE_STATUS,
  );

  return response.data.data.disabledAlarmType;
};

interface UpdateAlarmActiveStatusResponse extends ApiResponse {
  data: {
    userId: number;
    alarms: {
      alarmType: string;
      isDisabled: boolean;
    }[];
  };
}

export const updateAlarmActiveStatusApi = async (alarmTypes: string[]) => {
  const response = await axiosInstance.patch<UpdateAlarmActiveStatusResponse>(
    ALARM_SETTING_API_URL.ALARM_ACTIVE_STATUS,
    {
      alarmTypes,
    },
  );

  return response.data.data;
};
