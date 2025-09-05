import chatbot from "@assets/icon/chat-bot.svg";
import styles from "./ChatButton.module.css";

export const ChatButton = () => {
  return (
    <button
      className={styles["chat-button"]}
      type="button"
      aria-label="챗봇 열기"
    >
      <img src={chatbot} alt="챗봇" />
    </button>
  );
};