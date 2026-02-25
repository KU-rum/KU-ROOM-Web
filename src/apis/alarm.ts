// tanstack query 리팩토링 완료
// 알림 관련 api
import axiosInstance from "./axiosInstance";
import {
  AlarmListResponse,
  AlarmReadStatusResponse,
  ApiResponse,
  CheckAlarmRequest,
  CheckAlarmResponse,
  GetAlarmActiveStatusResponse,
  UpdateAlarmActiveStatusResponse,
} from "./types";
import { PAGE_SIZE } from "@constant/page";

const ALARMS_BASE_URL = "/alarm";
const ALARM_UNREAD_STATUS_URL = "/alarm/unread";
const CHECK_ALL_ALARMS_URL = "/alarm/read-all";
const ALARM_ACTIVE_STATUS_URL = "/alarm/disable";

// 알림 목록 조회 api
export const getAlarmListApi = async (lastKnown?: string) => {
  const response = await axiosInstance.get<AlarmListResponse>(ALARMS_BASE_URL, {
    params: { lastKnown, limit: PAGE_SIZE },
  });

  return response.data.data;
};

// 알림 읽음 처리 api
export const checkAlarmApi = async ({
  alarmId,
  alarmCategory,
}: CheckAlarmRequest) => {
  const response = await axiosInstance.patch<CheckAlarmResponse>(
    ALARMS_BASE_URL,
    {
      alarmId,
      alarmCategory,
    },
  );

  return response.data;
};

// 안 읽은 알림 존재 여부 및 개수 조회 api
export const getAlarmUnreadStatusApi = async () => {
  const response = await axiosInstance.get<AlarmReadStatusResponse>(
    ALARM_UNREAD_STATUS_URL,
  );

  return response.data;
};

// 모든 알림 읽음 처리 api
export const checkAllAlarmsApi = async () => {
  const response = await axiosInstance.patch<ApiResponse>(CHECK_ALL_ALARMS_URL);

  return response.data;
};

// 알림 설정 조회 api
export const getAlarmActiveStatusApi = async () => {
  const response = await axiosInstance.get<GetAlarmActiveStatusResponse>(
    ALARM_ACTIVE_STATUS_URL,
  );

  return response.data;
};

// 알림 설정 수정 api
export const updateAlarmActiveStatusApi = async (alarmTypes: string[]) => {
  const response = await axiosInstance.patch<UpdateAlarmActiveStatusResponse>(
    ALARM_ACTIVE_STATUS_URL,
    {
      alarmTypes,
    },
  );

  return response.data;
};
