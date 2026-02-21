import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteAllMapRecentSearchApi,
  deleteMapRecentSearchApi,
  saveMapRecentSearchApi,
} from "@apis/map";
import useToast from "@hooks/use-toast";
import { MAP_SEARCH_QUERY_KEY } from "../querykey";

export const useLocationKeyword = () => {
  const toast = useToast();
  const qc = useQueryClient();

  const { mutate: saveLocationKeyword } = useMutation({
    mutationFn: (search: string) => saveMapRecentSearchApi(search),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: MAP_SEARCH_QUERY_KEY.KEYWORD,
      });
    },
    onError: (error) => {
      toast.error(`검색어 저장 실패: ${error.message}`);
    },
  });

  const { mutate: deleteRecentKeyword } = useMutation({
    mutationFn: (keywordId: number) => deleteMapRecentSearchApi(keywordId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: MAP_SEARCH_QUERY_KEY.KEYWORD,
      });
    },
    onError: (error) => {
      toast.error(`검색어 삭제 실패: ${error.message}`);
    },
  });

  const { mutate: deleteAllRecentKeyword } = useMutation({
    mutationFn: () => deleteAllMapRecentSearchApi(),
    onSuccess: () => {
      toast.info("최근 검색어가 모두 삭제되었습니다.");
      qc.invalidateQueries({
        queryKey: MAP_SEARCH_QUERY_KEY.KEYWORD,
      });
    },
    onError: (error) => {
      toast.error(`검색어 삭제 실패: ${error.message}`);
    },
  });

  return {
    saveLocationKeyword,
    deleteRecentKeyword,
    deleteAllRecentKeyword,
  };
};
