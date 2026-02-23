import { useBookmarksQuery, useRemoveBookmarkMutation } from "@/queries";

export const useBookmarks = () => {
  const { data, isPending, isError, refetch } = useBookmarksQuery();
  const { removeBookmarkItem } = useRemoveBookmarkMutation();

  const bookmarks = data ?? [];

  const handleBookmarkToggle = (noticeId: number) => {
    const bookmark = bookmarks.find((b) => b.id === noticeId);
    if (bookmark?.bookmarkId) {
      removeBookmarkItem(bookmark.bookmarkId);
    }
  };

  return {
    bookmarks,
    loading: isPending,
    error: isError ? "북마크 데이터를 불러오는데 실패했습니다." : null,
    fetchBookmarks: refetch,
    handleBookmarkToggle,
  };
};
