import { NOTICE_LIST_MESSAGES } from "../../constants";
import styles from "./LoadingState.module.css";

export const LoadingState = () => {
  return (
    <div className={styles["loading"]}>
      <p>{NOTICE_LIST_MESSAGES.LOADING}</p>
    </div>
  );
};