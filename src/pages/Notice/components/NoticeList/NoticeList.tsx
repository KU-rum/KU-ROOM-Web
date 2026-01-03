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
  loadingMore = false,
  error = null,
  showBookmarkButton = true,
  showSortOptions = false,
  emptyMessage = NOTICE_LIST_MESSAGES.DEFAULT_EMPTY,
  category,
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

  const handleNoticeClick = (notice: typeof notices[0]) => {
    const categoryName = notice.categoryName || category;
    if (categoryName) {
      navigate(`/notice/${categoryName}/${notice.id}`);
    } else {
      navigate(`/notice/${notice.id}`);
    }
  };

  const handleBookmarkClick = (e: React.MouseEvent, noticeId: number) => {
    e.stopPropagation();
    if (onBookmarkToggle) {
      onBookmarkToggle(noticeId);
    }
  };

  if (loading && notices.length === 0) {
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
        <>
          <div className={styles["notice-list"]}>
            {sortedNotices.map((notice) => (
              <NoticeItem
                key={notice.id}
                notice={notice}
                showBookmarkButton={showBookmarkButton}
                onClick={() => handleNoticeClick(notice)}
                onBookmarkClick={
                  showBookmarkButton
                    ? (e) => handleBookmarkClick(e, notice.id)
                    : undefined
                }
              />
            ))}
          </div>
          {loadingMore && (
            <div style={{ padding: "20px", textAlign: "center" }}>
              <LoadingState />
            </div>
          )}
        </>
      ) : (
        <EmptyState message={emptyMessage} />
      )}
    </div>
  );
};

export default NoticeList;