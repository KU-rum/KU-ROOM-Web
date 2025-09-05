import { useState, useEffect } from "react";
import type { NoticeResponse } from "@apis/notice";
import { getBookmarks as getBookmarksAPI } from "@apis/notice";
import { transformBookmarkData } from "../utils/bookmarkTransform";

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<NoticeResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiBookmarks = await getBookmarksAPI();
      const transformedBookmarks = transformBookmarkData(apiBookmarks);
      setBookmarks(transformedBookmarks);
    } catch (err) {
      setError("북마크 데이터를 불러오는데 실패했습니다.");
      console.error("Failed to fetch bookmarks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkToggle = (noticeId: number) => {
    // 북마크 해제 시 목록에서 제거
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== noticeId));
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return {
    bookmarks,
    loading,
    error,
    fetchBookmarks,
    handleBookmarkToggle,
  };
};