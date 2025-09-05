import BottomBar from "@components/BottomBar/BottomBar";
import NoticeList from "../components/NoticeList/NoticeList";
import { BookmarkHeader } from "./components";
import { useBookmarks } from "./hooks/useBookmarks";
import { BOOKMARK_MESSAGES } from "./constants";
import styles from "./Bookmark.module.css";

const Bookmark = () => {
  const { bookmarks, loading, error, fetchBookmarks, handleBookmarkToggle } = useBookmarks();


  return (
    <div className={styles["bookmark-container"]}>
      <BookmarkHeader />

      <div className={styles["scrollable-content"]}>
        <NoticeList
          notices={bookmarks}
          loading={loading}
          error={error}
          showBookmarkButton={false}
          showSortOptions={true}
          emptyMessage={BOOKMARK_MESSAGES.EMPTY_MESSAGE}
          onBookmarkToggle={handleBookmarkToggle}
          onRetry={fetchBookmarks}
        />
      </div>

      <BottomBar />
    </div>
  );
};

export default Bookmark;