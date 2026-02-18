import { AlarmType } from "@apis/types";
import FriendIcon from "@assets/homemenuicon/homeicon_plus_friend.png";
import NoticeIcon from "@assets/homemenuicon/homeicon_kcube_reserve.png";
import RankingIcon from "@assets/homemenuicon/homeicon_search_location.png";

export const getCategory = (category: AlarmType) => {
  switch (category) {
    case AlarmType.NEW_FRIEND_PLACE_SHARING:
    case AlarmType.NEW_FRIEND_REQUEST:
      return "친구";
    case AlarmType.NEW_NOTICE:
    case AlarmType.NEW_KEYWORD_NOTICE:
      return "공지사항";
    case AlarmType.RENEW_RANK_PLACE:
    case AlarmType.RENEW_TOP_RANK_PLACE:
      return "내 장소 랭킹";
    default:
      return "DEFAULT";
  }
};

export const getCategoryIcon = (category: AlarmType) => {
  switch (category) {
    case AlarmType.NEW_FRIEND_PLACE_SHARING:
    case AlarmType.NEW_FRIEND_REQUEST:
      return FriendIcon;
    case AlarmType.NEW_NOTICE:
    case AlarmType.NEW_KEYWORD_NOTICE:
      return NoticeIcon;
    case AlarmType.RENEW_RANK_PLACE:
    case AlarmType.RENEW_TOP_RANK_PLACE:
      return RankingIcon;
    default:
      return "https://placehold.co/";
  }
};
