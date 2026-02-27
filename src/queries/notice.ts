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
  getBookmarksApi,
  searchNoticesApi,
  getKeywordsApi,
  getRecentSearchesApi,
  registerKeywordApi,
  saveRecentSearchApi,
  deleteRecentSearchApi,
  deleteAllRecentSearchesApi,
  type NoticeResponse,
} from "@apis/notice";
import { decodeBase64ToUTF8 } from "@/shared/utils/base64";
import { getCategoryId } from "@constant/categoryMapping";
import { transformBookmarkToNotice } from "@pages/Notice/Bookmark/utils/bookmarkTransform";
import { NOTICE_QUERY_KEY, BOOKMARK_QUERY_KEY, SEARCH_QUERY_KEY } from "@/queryKey";
import useDebounce from "@hooks/use-debounce";
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
    queryKey: NOTICE_QUERY_KEY.DETAIL(id, category),
    queryFn: async (): Promise<NoticeResponse> => {
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
      if (isBookMarked && bookmarkId !== undefined) {
        await removeBookmarkApi(bookmarkId);
        return { isBookMarked: false, bookmarkId: undefined };
      } else {
        const newBookmarkId = await addBookmarkApi(noticeId);
        return { isBookMarked: true, bookmarkId: newBookmarkId };
      }
    },
    onSuccess: (result) => {
      // 동일 공지의 모든 카테고리 키 캐시에 북마크 상태 즉시 반영
      // 북마크 페이지(/notice/:id)와 공지 목록(/notice/:category/:id)은 경로가 달라 쿼리 키가 다르게 생성되므로
      // predicate로 id가 일치하는 모든 detail 캐시를 한 번에 갱신
      qc.setQueriesData(
        {
          predicate: (query) => {
            const key = query.queryKey as unknown[];
            return key[0] === "notices" && key[1] === "detail" && key[2] === id;
          },
        },
        (prev: any) => (prev ? { ...prev, ...result } : prev),
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
    queryFn: async (): Promise<NoticeResponse[]> => {
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
    queryFn: async (): Promise<NoticeResponse[]> => {
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

// 북마크 목록 조회
export const useBookmarksQuery = () => {
  const toast = useToast();

  const {
    data: bookmarksData,
    isPending: isPendingBookmarks,
    isError: isErrorBookmarks,
    refetch: refetchBookmarks,
  } = useQuery({
    queryKey: BOOKMARK_QUERY_KEY.LIST,
    queryFn: async (): Promise<NoticeResponse[]> => {
      const apiData = await getBookmarksApi();
      return transformBookmarkToNotice(apiData);
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
  });

  useEffect(() => {
    if (isErrorBookmarks) {
      toast.error("북마크 데이터를 불러오는데 실패했습니다.");
    }
  }, [isErrorBookmarks, toast]);

  return { bookmarksData, isPendingBookmarks, isErrorBookmarks, refetchBookmarks };
};

// 북마크 삭제 (북마크 목록 페이지에서 사용)
export const useRemoveBookmarkMutation = () => {
  const toast = useToast();
  const qc = useQueryClient();

  const { mutate: removeBookmarkItem } = useMutation({
    mutationFn: (bookmarkId: number) => removeBookmarkApi(bookmarkId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BOOKMARK_QUERY_KEY.LIST });
    },
    onError: () => {
      toast.error("북마크 삭제에 실패했습니다.");
    },
  });

  return { removeBookmarkItem };
};

// 공지사항 검색 (디바운싱 적용)
export const useSearchNoticesQuery = (keyword: string) => {
  const toast = useToast();
  const debouncedKeyword = useDebounce(keyword, 500);
  const trimmedKeyword = debouncedKeyword.trim();

  const {
    data: searchData,
    isPending: isPendingSearch,
    isError: isErrorSearch,
  } = useQuery({
    queryKey: SEARCH_QUERY_KEY.RESULTS(trimmedKeyword),
    queryFn: () => searchNoticesApi({ keyword: trimmedKeyword }),
    enabled: !!trimmedKeyword,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (isErrorSearch) {
      toast.error("검색에 실패했어요");
    }
  }, [isErrorSearch, toast]);

  const searchResult = searchData?.content ?? [];

  return {
    searchResult,
    isPendingSearch: isPendingSearch && !!trimmedKeyword,
    isErrorSearch,
  };
};

// 최근 검색어 목록
export const useRecentSearchesQuery = () => {
  const { data: recentSearchesData } = useQuery({
    queryKey: SEARCH_QUERY_KEY.RECENT,
    queryFn: () => getRecentSearchesApi(20),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  return { recentSearchesData };
};

// 키워드 알림 목록
export const useKeywordsQuery = () => {
  const { data: keywordsData } = useQuery({
    queryKey: SEARCH_QUERY_KEY.KEYWORDS,
    queryFn: () => getKeywordsApi(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });

  return { keywordsData };
};

// 최근 검색어 저장/삭제 뮤테이션
export const useRecentSearchMutation = () => {
  const toast = useToast();
  const qc = useQueryClient();

  const { mutate: saveSearch } = useMutation({
    mutationFn: (keyword: string) => saveRecentSearchApi(keyword),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SEARCH_QUERY_KEY.RECENT });
    },
    onError: () => {
      toast.error("검색어 저장에 실패했어요");
    },
  });

  const { mutate: deleteSearch } = useMutation({
    mutationFn: (id: number) => deleteRecentSearchApi(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SEARCH_QUERY_KEY.RECENT });
    },
    onError: () => {
      toast.error("검색어 삭제에 실패했어요");
    },
  });

  const { mutate: deleteAllSearches } = useMutation({
    mutationFn: () => deleteAllRecentSearchesApi(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SEARCH_QUERY_KEY.RECENT });
    },
    onError: () => {
      toast.error("검색어 삭제에 실패했어요");
    },
  });

  return { saveSearch, deleteSearch, deleteAllSearches };
};

// 키워드 알림 토글 뮤테이션
export const useKeywordMutation = () => {
  const toast = useToast();
  const qc = useQueryClient();

  const { mutate: toggleKeyword } = useMutation({
    mutationFn: (keyword: string) => registerKeywordApi(keyword),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: SEARCH_QUERY_KEY.KEYWORDS });
      toast.info("키워드 설정이 반영되었어요");
    },
    onError: () => {
      toast.error("키워드 설정에 실패했어요");
    },
  });

  return { toggleKeyword };
};
