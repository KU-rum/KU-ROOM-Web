import axiosInstance from "@/apis/axiosInstance";
import { ApiResponse } from "@/shared/types";
import { AlarmCategory, AlarmDataType } from "@pages/Alarm/types";
import { PAGE_SIZE } from "@/shared/constant/page";

const ALARM_API_URL = {
  BASE: "/alarm",
  UNREAD_STATUS: "/alarm/unread",
  CHECK_ALL: "/alarm/read-all",
};

export interface AlarmListResponseData extends ApiResponse {
  alarms: AlarmDataType[];
  hasNext: boolean;
  nextCursor: string;
}

interface AlarmListResponse {
  data: AlarmListResponseData;
}

export const getAlarmListApi = async (lastKnown?: string) => {
  const response = await axiosInstance.get<AlarmListResponse>(
    ALARM_API_URL.BASE,
    { params: { lastKnown, limit: PAGE_SIZE } }
  );

  return response.data.data;
};

export interface CheckAlarmParams {
  alarmId: number;
  alarmCategory: AlarmCategory;
}

export const checkAlarmApi = async ({
  alarmId,
  alarmCategory,
}: CheckAlarmParams) =>
  await axiosInstance.patch(ALARM_API_URL.BASE, {
    alarmId,
    alarmCategory,
  });

export interface AlarmReadStatusResponseData {
  hasUnread: boolean;
  count: number;
}

interface AlarmReadStatusResponse extends ApiResponse {
  data: AlarmReadStatusResponseData;
}

export const getAlarmReadStatus = async () => {
  const response = await axiosInstance.get<AlarmReadStatusResponse>(
    ALARM_API_URL.UNREAD_STATUS
  );

  return response.data.data;
};

export const checkAllAlarmsApi = async () => {
  const response = await axiosInstance.patch<ApiResponse>(
    ALARM_API_URL.CHECK_ALL
  );

  return response.data;
};
