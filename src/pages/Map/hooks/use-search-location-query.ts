import { useQuery } from "@tanstack/react-query";

import { getMapRecentSearchApi, getMapSearchResultApi } from "@apis/map";
import { MapRecentSearchData, MapSearchResult } from "@apis/types";
import useToast from "@hooks/use-toast";
import useDebounce from "@hooks/use-debounce";
import { MAP_SEARCH_QUERY_KEY } from "../querykey";

export const useSearchLocationQuery = (search: string) => {
  const toast = useToast();
  const debouncedText = useDebounce(search, 300);

  const {
    data: locationSearchResult,
    isPending: isPendingSearch,
    isError: isErrorSearch,
    error: searchError,
  } = useQuery<MapSearchResult[]>({
    queryKey: MAP_SEARCH_QUERY_KEY.SEARCH_RESULT(debouncedText),
    queryFn: () => getMapSearchResultApi(debouncedText),
    enabled: !!debouncedText.trim(),
    staleTime: 1000 * 60 * 3,
  });

  const {
    data: recentLocationKeyword,
    isPending: isPendingRecentSearch,
    isError: isErrorKeyword,
  } = useQuery<MapRecentSearchData[]>({
    queryKey: MAP_SEARCH_QUERY_KEY.KEYWORD,
    queryFn: () => getMapRecentSearchApi(),
    staleTime: 1000 * 60,
  });

  if (isErrorSearch) {
    toast.error(`검색 실패 : ${searchError.message}`);
  }

  if (isErrorKeyword) {
    toast.error("최근 검색어 조회 실패");
  }

  return {
    locationSearchResult,
    isPendingSearch,
    recentLocationKeyword,
    isPendingRecentSearch,
  };
};
