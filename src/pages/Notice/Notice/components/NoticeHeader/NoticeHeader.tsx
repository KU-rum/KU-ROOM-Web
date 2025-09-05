import Header from "@components/Header/Header";
import styles from "./NoticeHeader.module.css";

interface NoticeHeaderProps {
  title?: string;
}

export const NoticeHeader = ({ title = "공지사항" }: NoticeHeaderProps) => {
  return (
    <div className={styles["fixed-header"]}>
      <Header>{title}</Header>
    </div>
  );
};