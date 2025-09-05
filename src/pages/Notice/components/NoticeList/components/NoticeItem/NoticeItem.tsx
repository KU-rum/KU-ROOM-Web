import BookmarkIcon from "@assets/headericon/bookmark.svg";
import BookmarkFillIcon from "@assets/headericon/bookmark-fill.svg";
import type { NoticeResponse } from "@apis/notice";
import { NOTICE_LIST_MESSAGES } from "../../constants";
import styles from "./NoticeItem.module.css";

interface NoticeItemProps {
  notice: NoticeResponse;
  showBookmarkButton: boolean;
  onClick: () => void;
  onBookmarkClick?: (e: React.MouseEvent) => void;
}

export const NoticeItem = ({
  notice,
  showBookmarkButton,
  onClick,
  onBookmarkClick
}: NoticeItemProps) => {
  return (
    <div
      className={styles["notice-item"]}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`공지사항: ${notice.title}, 날짜: ${notice.pubDate}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <div className={styles["notice-content-area"]}>
        <h3 className={styles["notice-item-title"]}>
          {notice.title}
        </h3>
        <p className={styles["notice-item-date"]}>
          {notice.pubDate.split(' ')[0]}
        </p>
      </div>
      {showBookmarkButton && onBookmarkClick && (
        <button
          className={styles["bookmark-button"]}
          onClick={onBookmarkClick}
          aria-label={`북마크 ${notice.isBookMarked ? NOTICE_LIST_MESSAGES.BOOKMARK_REMOVE : NOTICE_LIST_MESSAGES.BOOKMARK_ADD}`}
          type="button"
        >
          <img
            src={notice.isBookMarked ? BookmarkFillIcon : BookmarkIcon}
            alt={notice.isBookMarked ? NOTICE_LIST_MESSAGES.BOOKMARK_ADDED : NOTICE_LIST_MESSAGES.BOOKMARK_NOT_ADDED}
            className={styles["bookmark-icon"]}
          />
        </button>
      )}
    </div>
  );
};