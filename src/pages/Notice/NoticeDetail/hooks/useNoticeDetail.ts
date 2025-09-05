import { useState, useEffect } from "react";
import type { NoticeResponse } from "@apis/notice";
import { getNotices, addBookmark, removeBookmark } from "@apis/notice";
import { NOTICE_DETAIL_MESSAGES, NOTICE_DETAIL_CONFIG } from "../constants";

export const useNoticeDetail = (id: string | undefined) => {
  const [notice, setNotice] = useState<NoticeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNoticeDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        
        // 전체 공지사항을 가져와서 해당 ID의 공지사항 찾기
        const allNotices = await getNotices({ size: NOTICE_DETAIL_CONFIG.DEFAULT_PAGE_SIZE });
        const foundNotice = allNotices.find(n => n.id === parseInt(id));
        
        if (foundNotice) {
          setNotice(foundNotice);
        } else {
          setError(NOTICE_DETAIL_MESSAGES.NOT_FOUND);
        }
      } catch (err) {
        setError(NOTICE_DETAIL_MESSAGES.FETCH_ERROR);
        console.error("Failed to fetch notice detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticeDetail();
  }, [id]);

  const handleBookmarkToggle = async () => {
    if (!notice) return;
    
    try {
      if (notice.isBookMarked) {
        await removeBookmark(notice.id);
      } else {
        await addBookmark(notice.id);
      }
      
      // 북마크 상태 업데이트
      setNotice(prev => prev ? { ...prev, isBookMarked: !prev.isBookMarked } : null);
    } catch (error) {
      console.error(NOTICE_DETAIL_MESSAGES.BOOKMARK_TOGGLE_ERROR, error);
    }
  };

  const handleOriginalLinkClick = () => {
    if (notice?.link) {
      window.open(notice.link, '_blank');
    }
  };

  return {
    notice,
    loading,
    error,
    handleBookmarkToggle,
    handleOriginalLinkClick,
  };
};