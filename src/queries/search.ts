import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  searchNotices,
  getKeywords,
  getRecentSearches,
  registerKeyword,
  saveRecentSearch,
  deleteRecentSearch,
  deleteAllRecentSearches,
} from "@apis/search";
import useDebounce from "@hooks/use-debounce";
import { SEARCH_QUERY_KEY } from "@/queryKey";
import useToast from "@hooks/use-toast";

// 공지사항 검색 (디바운싱 적용)
export const useSearchNoticesQuery = (keyword: string) => {
  const toast = useToast();
  const debouncedKeyword = useDebounce(keyword, 500);

  const query = useQuery({
    queryKey: SEARCH_QUERY_KEY.RESULTS(debouncedKeyword),
    queryFn: () => searchNotices({ keyword: debouncedKeyword }),
    enabled: !!debouncedKeyword.trim(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error("검색에 실패했어요");
    }
  }, [query.isError, toast]);

  const searchResult = query.data?.content ?? [];

  return {
    searchResult,
    isPending: query.isPending && !!debouncedKeyword.trim(),
    isError: query.isError,
  };
};

// 최근 검색어 목록
export const useRecentSearchesQuery = () => {
  return useQuery({
    queryKey: SEARCH_QUERY_KEY.RECENT,
    queryFn: () => getRecentSearches(20),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};

// 키워드 알림 목록
export const useKeywordsQuery = () => {
  return useQuery({
    queryKey: SEARCH_QUERY_KEY.KEYWORDS,
    queryFn: () => getKeywords(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
};

// 최근 검색어 저장/삭제 뮤테이션
export const useRecentSearchMutation = () => {
  const toast = useToast();
  const qc = useQueryClient();

  const { mutate: saveSearch } = useMutation({
    mutationFn: (keyword: string) => saveRecentSearch(keyword),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SEARCH_QUERY_KEY.RECENT });
    },
    onError: () => {
      toast.error("검색어 저장에 실패했어요");
    },
  });

  const { mutate: deleteSearch } = useMutation({
    mutationFn: (id: number) => deleteRecentSearch(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SEARCH_QUERY_KEY.RECENT });
    },
    onError: () => {
      toast.error("검색어 삭제에 실패했어요");
    },
  });

  const { mutate: deleteAllSearches } = useMutation({
    mutationFn: () => deleteAllRecentSearches(),
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
    mutationFn: (keyword: string) => registerKeyword(keyword),
    onSuccess: (_, keyword) => {
      // 현재 캐시 상태를 기준으로 토글 처리
      qc.setQueryData<string[]>(SEARCH_QUERY_KEY.KEYWORDS, (prev = []) => {
        const isSubscribed = prev.includes(keyword);
        if (isSubscribed) {
          toast.info("키워드 알림이 해제되었어요");
          return prev.filter((k) => k !== keyword);
        }
        toast.info("키워드 알림이 등록되었어요");
        return [...prev, keyword];
      });
    },
    onError: () => {
      toast.error("키워드 설정에 실패했어요");
    },
  });

  return { toggleKeyword };
};
