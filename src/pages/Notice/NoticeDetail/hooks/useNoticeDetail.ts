import { useNoticeDetailQuery, useNoticeBookmarkMutation } from "@/queries";

export const useNoticeDetail = (
  id: string | undefined,
  category: string | undefined,
) => {
  const { data, isPending, isError } = useNoticeDetailQuery(id, category);
  const { toggleBookmark } = useNoticeBookmarkMutation(id);

  const handleBookmarkToggle = () => {
    if (!data) return;
    toggleBookmark({
      isBookMarked: data.isBookMarked,
      bookmarkId: data.bookmarkId,
      noticeId: data.id,
    });
  };

  return {
    notice: data ?? null,
    loading: isPending,
    error: isError ? "공지사항을 불러오는 중 오류가 발생했습니다." : null,
    handleBookmarkToggle,
  };
};
