import { useState, useEffect, useRef } from "react";
import type { NoticeResponse } from "@apis/notice";
import { getBookmarks as getBookmarksAPI } from "@apis/bookmark";
import { transformBookmarkToNotice } from "../utils/bookmarkTransform";

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<NoticeResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiBookmarks = await getBookmarksAPI();
      const notices = transformBookmarkToNotice(apiBookmarks);
      setBookmarks(notices);
    } catch (err: unknown) {
      setError("북마크 데이터를 불러오는데 실패했습니다.");
      console.error("Failed to fetch bookmarks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkToggle = (noticeId: number) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== noticeId));
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchBookmarks();
    }
  }, []);

  return {
    bookmarks,
    loading,
    error,
    fetchBookmarks,
    handleBookmarkToggle,
  };
};