import { ApiResponse } from ".";

export enum AlarmType {
  NEW_FRIEND_REQUEST = "NEW_FRIEND_REQUEST",
  NEW_FRIEND_PLACE_SHARING = "NEW_FRIEND_PLACE_SHARING",
  NEW_NOTICE = "NEW_NOTICE",
  NEW_KEYWORD_NOTICE = "NEW_KEYWORD_NOTICE",
  RENEW_TOP_RANK_PLACE = "RENEW_TOP_RANK_PLACE",
  RENEW_RANK_PLACE = "RENEW_RANK_PLACE",
}

export enum AlarmCategory {
  ALARM = "ALARM",
  ANNOUNCEMENT = "ANNOUNCEMENT",
}

export interface AlarmContentType {
  category: string[];
  name: string;
}

export interface AlarmDataType {
  id: number;
  alarmType: AlarmType;
  alarmCategory: AlarmCategory;
  message: string;
  isChecked: boolean;
  dataId: string | null;
  createdAt: string;
}

export interface AlarmListResponseData {
  alarms: AlarmDataType[];
  hasNext: boolean;
  nextCursor?: string;
}

export interface AlarmListResponse extends ApiResponse {
  data: AlarmListResponseData;
}

export interface CheckAlarmRequest {
  alarmId: number;
  alarmCategory: AlarmCategory;
}

export interface CheckAlarmResponseData {
  id: number;
  alarmType: string;
  message: string;
  dataId: string;
}

export interface CheckAlarmResponse extends ApiResponse {
  data: CheckAlarmResponseData;
}

export interface AlarmReadStatusResponseData {
  hasUnread: boolean;
  count: number;
}

export interface AlarmReadStatusResponse extends ApiResponse {
  data: AlarmReadStatusResponseData;
}

export interface GetAlarmActiveStatusResponse extends ApiResponse {
  data: {
    disabledAlarmType: string[];
  };
}

export interface UpdateAlarmActiveStatusResponse extends ApiResponse {
  data: {
    userId: number;
    alarms: {
      alarmType: string;
      isDisabled: boolean;
    }[];
  };
}
