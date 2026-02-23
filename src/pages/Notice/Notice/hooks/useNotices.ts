import { useNoticesInfiniteQuery } from "@/queries";
import { getCategoryId } from "@constant/categoryMapping";
import type { NoticeListResponse } from "@apis/notice";

export const useNotices = (activeTab: string) => {
  const categoryId = getCategoryId(activeTab);

  const { data, isFetching, hasNextPage, fetchNextPage } =
    useNoticesInfiniteQuery(categoryId ? String(categoryId) : "");

  const notices =
    data?.pages.flatMap((page: NoticeListResponse) => page.content) ?? [];

  return {
    notices,
    loading: isFetching,
    hasMore: hasNextPage,
    loadMoreNotices: fetchNextPage,
  };
};
