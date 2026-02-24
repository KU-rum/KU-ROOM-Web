import { useBookmarksQuery, useRemoveBookmarkMutation } from "@/queries";

export const useBookmarks = () => {
  const { bookmarksData, isPendingBookmarks, isErrorBookmarks, refetchBookmarks } = useBookmarksQuery();
  const { removeBookmarkItem } = useRemoveBookmarkMutation();

  const bookmarks = bookmarksData ?? [];

  const handleBookmarkToggle = (noticeId: number) => {
    const bookmark = bookmarks.find((b) => b.id === noticeId);
    if (bookmark?.bookmarkId) {
      removeBookmarkItem(bookmark.bookmarkId);
    }
  };

  return {
    bookmarks,
    loading: isPendingBookmarks,
    error: isErrorBookmarks ? "북마크 데이터를 불러오는데 실패했습니다." : null,
    fetchBookmarks: refetchBookmarks,
    handleBookmarkToggle,
  };
};
