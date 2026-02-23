import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { NoticeResponse } from "@apis/notice";
import { getNoticeDetail } from "@apis/notice";
import { addBookmark, removeBookmark } from "@apis/bookmark";
import { NOTICE_DETAIL_MESSAGES } from "../constants";
import { decodeBase64ToUTF8 } from "@/shared/utils/base64";
import { getCategoryId } from "@constant/categoryMapping";
import useToast from "@/shared/hooks/use-toast";

export const useNoticeDetail = (
  id: string | undefined,
  category: string | undefined
) => {
  const [notice, setNotice] = useState<NoticeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchedKeyRef = useRef<string | null>(null);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchNoticeDetail = async () => {
      const currentKey = `${id}-${category}`;
      if (!id || fetchedKeyRef.current === currentKey) return;

      fetchedKeyRef.current = currentKey;

      try {
        setLoading(true);
        setError(null);

        // 상세 정보 조회
        const detailData = await getNoticeDetail(id);
        const decodedContent = decodeBase64ToUTF8(detailData.content);

        // 카테고리 정보 처리
        let categoryId = 0;
        let categoryName = "";

        if (category) {
          // URL에 카테고리가 있는 경우
          const resolvedCategoryId = getCategoryId(category);
          if (resolvedCategoryId === undefined) {
            setError(NOTICE_DETAIL_MESSAGES.NOT_FOUND);
            return;
          }
          categoryId = resolvedCategoryId;
          categoryName = category;
        }

        // NoticeResponse 형식에 맞게 데이터 구성
        setNotice({
          id: detailData.id,
          categoryId,
          categoryName,
          title: detailData.title,
          link: detailData.link,
          content: decodedContent,
          pubDate: detailData.pubdate,
          author: "",
          description: "",
          isBookMarked: detailData.isBookmark,
          bookmarkId: detailData.bookmarkId,
        });
      } catch (err: any) {
        if (err?.status === "NOT_FOUND") {
          toast.error(NOTICE_DETAIL_MESSAGES.NOT_FOUND);
          navigate("/alarm", { replace: true });
          return;
        }
        setError(NOTICE_DETAIL_MESSAGES.FETCH_ERROR);
        console.error("Failed to fetch notice detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticeDetail();
  }, [id, category]);

  const handleBookmarkToggle = async () => {
    if (!notice) return;

    try {
      if (notice.isBookMarked && notice.bookmarkId) {
        // 북마크 삭제
        await removeBookmark(notice.bookmarkId);
        setNotice((prev) =>
          prev ? { ...prev, isBookMarked: false, bookmarkId: undefined } : null
        );
      } else {
        // 북마크 추가
        const bookmarkId = await addBookmark(notice.id);
        setNotice((prev) =>
          prev ? { ...prev, isBookMarked: true, bookmarkId } : null
        );
      }
    } catch (error) {
      console.error(NOTICE_DETAIL_MESSAGES.BOOKMARK_TOGGLE_ERROR, error);
      toast.error(NOTICE_DETAIL_MESSAGES.BOOKMARK_TOGGLE_ERROR);
    }
  };

  return {
    notice,
    loading,
    error,
    handleBookmarkToggle,
  };
};
