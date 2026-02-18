import { useNavigate } from "react-router-dom";

import useToast from "@hooks/use-toast";
import { AlarmDataType, AlarmType } from "@apis/types";

import {
  getCategory,
  getCategoryIcon,
} from "@pages/Alarm/utils/alarm-category";
import { formatDateTime } from "@pages/Alarm/utils/format-time";
import styles from "./AlarmItem.module.css";
import { useCheckAlarmMutation } from "@/queries";

interface AlarmItemProps {
  alarm: AlarmDataType;
}

const AlarmItem = ({ alarm }: AlarmItemProps) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { checkAlarm } = useCheckAlarmMutation();

  const handleCheckAlarm = () => {
    checkAlarm({ alarmId: alarm.id, alarmCategory: alarm.alarmCategory });
    handleNavigate();
  };

  const handleNavigate = () => {
    switch (alarm.alarmType) {
      case AlarmType.NEW_FRIEND_REQUEST:
        navigate("/friendadd");
        break;
      case AlarmType.NEW_FRIEND_PLACE_SHARING:
        navigate("/map", { state: { isFriendChip: true } });
        break;
      case AlarmType.NEW_NOTICE:
      case AlarmType.NEW_KEYWORD_NOTICE:
        navigate(`/notice/${alarm.dataId}`);
        break;
      case AlarmType.RENEW_RANK_PLACE:
      case AlarmType.RENEW_TOP_RANK_PLACE:
        navigate("/mylocationranking");
        break;
      default:
        toast.error("잘못된 알림입니다.");
        navigate("/");
    }
  };
  return (
    <button
      type="button"
      className={`${styles.AlarmContainer} ${
        !alarm.isChecked ? styles.UnreadAlarm : ""
      }`}
      onClick={handleCheckAlarm}
    >
      <div className={styles.AlarmStateWrapper}>
        <div className={styles.AlarmCategoryWrapper}>
          <img
            className={styles.AlarmStateIcon}
            src={getCategoryIcon(alarm.alarmType)}
            alt={getCategory(alarm.alarmType) + " 아이콘"}
          />
          <span className={styles.AlarmGrayText}>
            {getCategory(alarm.alarmType)}
          </span>
        </div>
        <span className={styles.AlarmGrayText}>
          {formatDateTime(alarm.createdAt)}
        </span>
      </div>
      <span className={styles.AlarmMessage}>{alarm.message}</span>
    </button>
  );
};

export default AlarmItem;
