import { NOTICE_LIST_MESSAGES } from "../../constants";
import styles from "./ErrorState.module.css";

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <div className={styles["error"]}>
      <p>{error}</p>
      {onRetry && (
        <button onClick={onRetry} type="button">
          {NOTICE_LIST_MESSAGES.RETRY_BUTTON}
        </button>
      )}
    </div>
  );
};