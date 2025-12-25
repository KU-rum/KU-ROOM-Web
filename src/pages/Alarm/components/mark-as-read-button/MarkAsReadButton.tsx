import { useCheckAlarm } from "@pages/Alarm/hooks/use-check-alarm";

import styles from "./MarkAsReadButton.module.css";

export default function MarkAsReadButton() {
  const { checkAllAlarms } = useCheckAlarm();
  return (
    <button
      type="button"
      className={styles.ButtonContainer}
      onClick={() => checkAllAlarms()}
    >
      <span className={styles.MarkAsReadText}>모두 읽음으로 표시</span>
    </button>
  );
}
