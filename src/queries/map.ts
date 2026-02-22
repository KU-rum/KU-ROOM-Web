import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import useToast from "@hooks/use-toast";
import useDebounce from "@hooks/use-debounce";
import {
  checkShareStatusApi,
  deleteAllMapRecentSearchApi,
  deleteMapRecentSearchApi,
  getCategoryLocationsApi,
  getLocationNameApi,
  getMapRecentSearchApi,
  getMapSearchResultApi,
  saveMapRecentSearchApi,
  shareUserLocationApi,
  unshareLocationApi,
} from "@apis/map";
import {
  CategoryEnum,
  CategoryLocationsResponse,
  Coordinate,
  MapRecentSearchResponse,
  MapSearchResultResponse,
  PlaceNameResponse,
  ShareStatusResponse,
} from "@apis/types";
import { MAP_QUERY_KEY } from "@/queryKey";

export const useCheckShareStatusQuery = () => {
  const {
    data,
    isPending: isPendingShareStatus,
    isError: isErrorShareStatus,
  } = useQuery<ShareStatusResponse>({
    queryKey: MAP_QUERY_KEY.USER_SHARE_STATUS,
    queryFn: () => checkShareStatusApi(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });

  const isSharedLocation = data?.data.isActive;
  const sharedLocationName = data?.data.placeName;

  return {
    isSharedLocation,
    sharedLocationName,
    isPendingShareStatus,
    isErrorShareStatus,
  };
};

export const useGetLocationNameQuery = (coord?: Coordinate) => {
  const toast = useToast();
  const debounced = useDebounce(coord, 500);

  const {
    data,
    isLoading: isLoadingGetLocationName,
    isError,
  } = useQuery<PlaceNameResponse>({
    queryKey: MAP_QUERY_KEY.PLACE_NAME(debounced),
    queryFn: () => getLocationNameApi(debounced),
    enabled: !!debounced,
    staleTime: 0,
    gcTime: 1000 * 3,
    retry: 1,
  });

  useEffect(() => {
    if (isError) {
      toast.error("장소 조회 실패");
    }
  }, [toast, isError]);

  const placeName = data?.data?.placeName;

  return { placeName, isLoadingGetLocationName };
};

export const useShareUserLocationMutation = () => {
  const toast = useToast();
  const qc = useQueryClient();

  const { mutate: shareUserLocation } = useMutation({
    mutationFn: (placeName: string) => shareUserLocationApi(placeName),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: MAP_QUERY_KEY.USER_SHARE_STATUS });
    },
    onError: (error) => {
      toast.error(`위치 공유 실패 : ${error.message}`);
    },
  });

  const { mutate: unshareUserLocation } = useMutation({
    mutationFn: () => unshareLocationApi(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: MAP_QUERY_KEY.USER_SHARE_STATUS });
    },
    onError: (error) => {
      toast.error(`위치 공유 해제 실패 : ${error.message}`);
    },
  });

  return {
    shareUserLocation,
    unshareUserLocation,
  };
};

export const useMapSearchQuery = (search: string) => {
  const toast = useToast();
  const debouncedText = useDebounce(search, 300);

  const {
    data: searchData,
    isPending: isPendingSearch,
    isError: isErrorSearch,
    error: searchError,
  } = useQuery<MapSearchResultResponse>({
    queryKey: MAP_QUERY_KEY.SEARCH_RESULT(debouncedText),
    queryFn: () => getMapSearchResultApi(debouncedText),
    enabled: !!debouncedText.trim(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });

  const {
    data: recentSearchData,
    isPending: isPendingRecentSearch,
    isError: isErrorKeyword,
  } = useQuery<MapRecentSearchResponse>({
    queryKey: MAP_QUERY_KEY.RECENT_SEARCH,
    queryFn: () => getMapRecentSearchApi(),
    staleTime: 1000 * 60 * 20,
    gcTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (isErrorSearch) {
      toast.error(`검색 실패 : ${searchError?.message}`);
    }
  }, [toast, isErrorSearch, searchError]);

  useEffect(() => {
    if (isErrorKeyword) {
      toast.error("최근 검색어 조회 실패");
    }
  }, [toast, isErrorKeyword]);

  const locationSearchResult = searchData?.data;
  const recentLocationKeyword = recentSearchData?.data;

  return {
    locationSearchResult,
    isPendingSearch,
    recentLocationKeyword,
    isPendingRecentSearch,
  };
};

export const useMapSearchMutation = () => {
  const toast = useToast();
  const qc = useQueryClient();

  const { mutate: saveMapSearch } = useMutation({
    mutationFn: (search: string) => saveMapRecentSearchApi(search),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: MAP_QUERY_KEY.RECENT_SEARCH,
      });
    },
    onError: (error) => {
      toast.error(`검색어 저장 실패: ${error.message}`);
    },
  });

  const { mutate: deleteMapRecentSearch } = useMutation({
    mutationFn: (keywordId: number) => deleteMapRecentSearchApi(keywordId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: MAP_QUERY_KEY.RECENT_SEARCH,
      });
    },
    onError: (error) => {
      toast.error(`검색어 삭제 실패: ${error.message}`);
    },
  });

  const { mutate: deleteAllMapRecentSearch } = useMutation({
    mutationFn: () => deleteAllMapRecentSearchApi(),
    onSuccess: () => {
      toast.info("최근 검색어가 모두 삭제되었습니다.");
      qc.invalidateQueries({
        queryKey: MAP_QUERY_KEY.RECENT_SEARCH,
      });
    },
    onError: (error) => {
      toast.error(`검색어 삭제 실패: ${error.message}`);
    },
  });

  return {
    saveMapSearch,
    deleteMapRecentSearch,
    deleteAllMapRecentSearch,
  };
};

export const useCategoryLocationsQuery = (category: CategoryEnum) => {
  const toast = useToast();
  const { data, isError } = useQuery<CategoryLocationsResponse>({
    queryKey: MAP_QUERY_KEY.CATEGORY_LOCATIONS(category),
    queryFn: () => getCategoryLocationsApi(category),
    enabled: !!category,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 20,
  });

  useEffect(() => {
    if (isError) {
      toast.error("장소 조회 중 오류가 발생했습니다.");
    }
  }, [toast, isError]);

  const categoryLocations = data?.data;

  return { categoryLocations };
};
