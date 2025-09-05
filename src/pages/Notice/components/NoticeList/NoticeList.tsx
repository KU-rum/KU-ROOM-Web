import { useNavigate } from "react-router-dom";
import type { NoticeListProps } from "./types";
import { useNoticeListSort } from "./hooks/useNoticeListSort";
import { 
  SortDropdown, 
  NoticeItem, 
  LoadingState, 
  ErrorState, 
  EmptyState 
} from "./components";
import { NOTICE_LIST_MESSAGES } from "./constants";
import styles from "./NoticeList.module.css";

const NoticeList = ({
  notices,
  loading = false,
  error = null,
  showBookmarkButton = true,
  showSortOptions = false,
  emptyMessage = NOTICE_LIST_MESSAGES.DEFAULT_EMPTY,
  onBookmarkToggle,
  onRetry
}: NoticeListProps) => {
  const navigate = useNavigate();
  const {
    sortOrder,
    showSort,
    setShowSort,
    sortedNotices,
    sortOptionsRef,
    handleSortOptionClick,
  } = useNoticeListSort(notices);

  const handleNoticeClick = (noticeId: number) => {
    navigate(`/notice/${noticeId}`);
  };

  const handleBookmarkClick = (e: React.MouseEvent, noticeId: number) => {
    e.stopPropagation();
    if (onBookmarkToggle) {
      onBookmarkToggle(noticeId);
    }
  };

  if (loading) {
    return (
      <div className={styles["notice-list-container"]}>
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles["notice-list-container"]}>
        <ErrorState error={error} onRetry={onRetry} />
      </div>
    );
  }

  return (
    <div className={styles["notice-list-container"]}>
      {showSortOptions && (
        <SortDropdown
          sortOrder={sortOrder}
          showSort={showSort}
          onToggleSort={() => setShowSort(!showSort)}
          onSortOptionClick={handleSortOptionClick}
          sortOptionsRef={sortOptionsRef}
        />
      )}

      {sortedNotices.length > 0 ? (
        <div className={styles["notice-list"]}>
          {sortedNotices.map((notice) => (
            <NoticeItem
              key={notice.id}
              notice={notice}
              showBookmarkButton={showBookmarkButton}
              onClick={() => handleNoticeClick(notice.id)}
              onBookmarkClick={
                showBookmarkButton 
                  ? (e) => handleBookmarkClick(e, notice.id)
                  : undefined
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState message={emptyMessage} />
      )}
    </div>
  );
};

export default NoticeList;