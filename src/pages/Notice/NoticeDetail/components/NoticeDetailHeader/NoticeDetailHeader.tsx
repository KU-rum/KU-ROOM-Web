import { useNavigate } from "react-router-dom";
import Header from "@components/Header/Header";
import BookmarkIcon from "@assets/headericon/bookmark.svg";
import BookmarkFillIcon from "@assets/headericon/bookmark-fill.svg";
import type { NoticeResponse } from "@apis/notice";
import { NOTICE_DETAIL_CONFIG } from "../../constants";
import styles from "./NoticeDetailHeader.module.css";

interface NoticeDetailHeaderProps {
  notice: NoticeResponse | null;
  category?: string;
  onBookmarkToggle: () => void;
}

export const NoticeDetailHeader = ({ 
  notice, 
  category, 
  onBookmarkToggle 
}: NoticeDetailHeaderProps) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles["header-wrapper"]}>
      <Header>{notice?.categoryName || category || NOTICE_DETAIL_CONFIG.DEFAULT_CATEGORY}</Header>
      <button
        className={styles["back-button"]}
        onClick={handleGoBack}
        aria-label="뒤로가기"
        type="button"
      />
      <button
        className={styles["bookmark-button"]}
        onClick={onBookmarkToggle}
        aria-label={`북마크 ${notice?.isBookMarked ? '해제' : '추가'}`}
        type="button"
        disabled={!notice}
      >
        <img
          src={notice?.isBookMarked ? BookmarkFillIcon : BookmarkIcon}
          alt={notice?.isBookMarked ? "북마크됨" : "북마크"}
        />
      </button>
    </div>
  );
};