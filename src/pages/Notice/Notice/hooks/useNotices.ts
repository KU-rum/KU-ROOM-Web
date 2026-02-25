import { useNoticesInfiniteQuery } from "@/queries";
import { getCategoryId } from "@constant/categoryMapping";
import type { NoticeListResponse } from "@apis/notice";

export const useNotices = (activeTab: string) => {
  const categoryId = getCategoryId(activeTab);

  const { noticesData, isFetchingNotices, hasNextNoticesPage, fetchNextNoticesPage } =
    useNoticesInfiniteQuery(categoryId ? String(categoryId) : "");

  const notices =
    noticesData?.pages.flatMap((page: NoticeListResponse) => page.content) ?? [];

  return {
    notices,
    loading: isFetchingNotices,
    hasMore: hasNextNoticesPage,
    loadMoreNotices: fetchNextNoticesPage,
  };
};
