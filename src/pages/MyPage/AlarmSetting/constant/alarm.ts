import { ALARM_CATEGORY, AlarmContentType } from "../types/alarm-type";

export const ALARM_SECTION_DATA: {
  title: string;
  contents: AlarmContentType[];
}[] = [
  {
    title: "친구",
    contents: [
      { category: ALARM_CATEGORY.NEW_FRIEND_REQUEST, name: "친구 신청" },
      {
        category: ALARM_CATEGORY.NEW_FRIEND_PLACE_SHARING,
        name: "친구 위치 공유",
      },
    ],
  },
  {
    title: "공지사항",
    contents: [
      { category: ALARM_CATEGORY.NEW_NOTICE, name: "새로운 공지 업로드" },
      { category: ALARM_CATEGORY.NEW_KEYWORD_NOTICE, name: "공지 키워드 알림" },
    ],
  },
  {
    title: "내 장소 랭킹",
    contents: [
      { category: ALARM_CATEGORY.RENEW_RANK_PLACE, name: "순위 변동 알림" },
    ],
  },
];
