import { useNoticeDetailQuery, useNoticeBookmarkMutation } from "@/queries";

export const useNoticeDetail = (
  id: string | undefined,
  category: string | undefined,
) => {
  const { noticeDetailData, isPendingNoticeDetail, isErrorNoticeDetail } = useNoticeDetailQuery(id, category);
  const { toggleBookmark } = useNoticeBookmarkMutation(id, category);

  const handleBookmarkToggle = () => {
    if (!noticeDetailData) return;
    toggleBookmark({
      isBookMarked: noticeDetailData.isBookMarked,
      bookmarkId: noticeDetailData.bookmarkId,
      noticeId: noticeDetailData.id,
    });
  };

  return {
    notice: noticeDetailData ?? null,
    loading: isPendingNoticeDetail,
    error: isErrorNoticeDetail ? "공지사항을 불러오는 중 오류가 발생했습니다." : null,
    handleBookmarkToggle,
  };
};
