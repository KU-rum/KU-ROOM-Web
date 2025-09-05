import { useState, useCallback } from "react";
import type { NoticeResponse } from "@apis/notice";
import { getNotices } from "@apis/notice";
import { getCategoryId } from "@constant/categoryMapping";
import { NOTICE_CONFIG } from "../constants";

export const useNotices = () => {
  const [notices, setNotices] = useState<NoticeResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const loadNoticesByCategory = useCallback(async (activeTab: string) => {
    const categoryId = getCategoryId(activeTab);
    if (!categoryId) return;

    setLoading(true);
    try {
      const response = await getNotices({
        categoryId,
        size: NOTICE_CONFIG.DEFAULT_PAGE_SIZE,
      });
      console.log("API 응답:", response);
      console.log("응답 타입:", typeof response);
      console.log("배열 여부:", Array.isArray(response));
      setNotices(response);
    } catch (error) {
      console.error("공지사항 로드 실패:", error);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    notices,
    loading,
    loadNoticesByCategory,
    setNotices,
  };
};