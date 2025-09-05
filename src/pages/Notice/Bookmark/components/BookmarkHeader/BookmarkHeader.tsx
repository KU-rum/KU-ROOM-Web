import { useNavigate } from "react-router-dom";
import Header from "@components/Header/Header";
import styles from "./BookmarkHeader.module.css";

interface BookmarkHeaderProps {
  title?: string;
}

export const BookmarkHeader = ({ title = "북마크" }: BookmarkHeaderProps) => {
  const navigate = useNavigate();

  const handleGoBack = (): void => {
    navigate(-1);
  };

  return (
    <div className={styles["fixed-header"]}>
      <Header>{title}</Header>
      <button
        className={styles["back-button"]}
        onClick={handleGoBack}
        aria-label="뒤로가기"
        type="button"
      />
    </div>
  );
};