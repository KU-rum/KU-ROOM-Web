import Header from "@components/Header/Header";

import AlarmItem from "@pages/Alarm/components/alarm-item/AlarmItem";
import { useAlarmList } from "@pages/Alarm/hooks/use-alarm-list";
import MarkAsReadButton from "@pages/Alarm/components/mark-as-read-button/MarkAsReadButton";

import styles from "./Alarm.module.css";

const Alarm = () => {
  const { listBottomRef, alarmList, unreadAlarmList, isPending } =
    useAlarmList();

  return (
    <>
      <Header>알림</Header>
      <div className={styles.AlarmContentWrapper}>
        {isPending && <div>로딩중...</div>}
        {alarmList.map((alarm) => (
          <AlarmItem key={alarm.id} alarm={alarm} />
        ))}
        <div
          ref={listBottomRef}
          style={{
            width: "100%",
            height: "1px",
          }}
        />
      </div>
      {unreadAlarmList.length !== 0 && <MarkAsReadButton />}
    </>
  );
};

export default Alarm;
