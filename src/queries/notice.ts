import { useEffect } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import {
  getNoticesApi,
  getNoticeDetailApi,
  getPopularNoticesApi,
  getPrimaryNoticesApi,
  getNoticeOthersApi,
  addBookmarkApi,
  removeBookmarkApi,
} from "@apis/notice";
import { decodeBase64ToUTF8 } from "@/shared/utils/base64";
import { getCategoryId } from "@constant/categoryMapping";
import { NOTICE_QUERY_KEY, BOOKMARK_QUERY_KEY } from "@/queryKey";
import useToast from "@hooks/use-toast";

const NOTICE_PAGE_SIZE = 20;

// 공지사항 목록 (무한 스크롤)
export const useNoticesInfiniteQuery = (categoryId: string) => {
  const {
    data: noticesData,
    isFetching: isFetchingNotices,
    hasNextPage: hasNextNoticesPage,
    fetchNextPage: fetchNextNoticesPage,
  } = useInfiniteQuery({
    queryKey: NOTICE_QUERY_KEY.LIST(categoryId),
    queryFn: ({ pageParam = 0 }) =>
      getNoticesApi({ category: categoryId, page: pageParam, size: NOTICE_PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.last ? undefined : lastPageParam + 1,
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
  });

  return { noticesData, isFetchingNotices, hasNextNoticesPage, fetchNextNoticesPage };
};

// 공지사항 상세 조회
export const useNoticeDetailQuery = (
  id: string | undefined,
  category: string | undefined,
) => {
  const toast = useToast();
  const navigate = useNavigate();

  const {
    data: noticeDetailData,
    isPending: isPendingNoticeDetail,
    isError: isErrorNoticeDetail,
    error: noticeDetailError,
  } = useQuery({
    queryKey: NOTICE_QUERY_KEY.DETAIL(id),
    queryFn: async () => {
      const detailData = await getNoticeDetailApi(id!);
      const decodedContent = decodeBase64ToUTF8(detailData.content);

      let categoryId = 0;
      let categoryName = "";

      if (category) {
        const resolvedCategoryId = getCategoryId(category);
        if (resolvedCategoryId === undefined) {
          throw Object.assign(new Error("카테고리를 찾을 수 없습니다."), {
            status: "NOT_FOUND",
          });
        }
        categoryId = resolvedCategoryId;
        categoryName = category;
      }

      return {
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
      };
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    retry: false,
  });

  useEffect(() => {
    if (noticeDetailError) {
      const err = noticeDetailError as any;
      if (err?.status === "NOT_FOUND") {
        toast.error("공지사항을 찾을 수 없습니다.");
        navigate("/alarm", { replace: true });
      }
    }
  }, [noticeDetailError, toast, navigate]);

  return { noticeDetailData, isPendingNoticeDetail, isErrorNoticeDetail };
};

// 북마크 토글 (공지사항 상세에서 사용)
export const useNoticeBookmarkMutation = (id: string | undefined) => {
  const toast = useToast();
  const qc = useQueryClient();

  const { mutate: toggleBookmark } = useMutation({
    mutationFn: async ({
      isBookMarked,
      bookmarkId,
      noticeId,
    }: {
      isBookMarked: boolean;
      bookmarkId?: number;
      noticeId: number;
    }) => {
      if (isBookMarked && bookmarkId) {
        await removeBookmarkApi(bookmarkId);
        return { isBookMarked: false, bookmarkId: undefined };
      } else {
        const newBookmarkId = await addBookmarkApi(noticeId);
        return { isBookMarked: true, bookmarkId: newBookmarkId };
      }
    },
    onSuccess: (result) => {
      // 상세 캐시 업데이트 (재요청 없이 즉시 반영)
      qc.setQueryData(NOTICE_QUERY_KEY.DETAIL(id), (prev: any) =>
        prev ? { ...prev, ...result } : prev,
      );
      // 북마크 목록 캐시 무효화
      qc.invalidateQueries({ queryKey: BOOKMARK_QUERY_KEY.LIST });
    },
    onError: () => {
      toast.error("북마크 설정에 실패했습니다.");
    },
  });

  return { toggleBookmark };
};

// 인기 공지사항
export const usePopularNoticesQuery = () => {
  const toast = useToast();

  const {
    data: popularNoticesData,
    isPending: isPendingPopularNotices,
    isError: isErrorPopularNotices,
  } = useQuery({
    queryKey: NOTICE_QUERY_KEY.POPULAR,
    queryFn: async () => {
      const response = await getPopularNoticesApi();
      return response.data;
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    if (isErrorPopularNotices) {
      toast.error("인기 공지를 불러오지 못했어요");
    }
  }, [isErrorPopularNotices, toast]);

  return { popularNoticesData, isPendingPopularNotices, isErrorPopularNotices };
};

// 주요 공지사항
export const usePrimaryNoticesQuery = () => {
  const toast = useToast();

  const {
    data: primaryNoticesData,
    isPending: isPendingPrimaryNotices,
    isError: isErrorPrimaryNotices,
  } = useQuery({
    queryKey: NOTICE_QUERY_KEY.PRIMARY,
    queryFn: async () => {
      const response = await getPrimaryNoticesApi();
      return response.data;
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    if (isErrorPrimaryNotices) {
      toast.error("주요 공지를 불러오지 못했어요");
    }
  }, [isErrorPrimaryNotices, toast]);

  return { primaryNoticesData, isPendingPrimaryNotices, isErrorPrimaryNotices };
};

// 기타 탭 (학과 링크)
export const useNoticeOthersQuery = () => {
  const toast = useToast();

  const {
    data: noticeOthersData,
    isPending: isPendingNoticeOthers,
    isError: isErrorNoticeOthers,
  } = useQuery({
    queryKey: NOTICE_QUERY_KEY.OTHERS,
    queryFn: () => getNoticeOthersApi(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    if (isErrorNoticeOthers) {
      toast.error("학과 정보 조회를 실패했습니다.");
    }
  }, [isErrorNoticeOthers, toast]);

  return { noticeOthersData, isPendingNoticeOthers, isErrorNoticeOthers };
};
