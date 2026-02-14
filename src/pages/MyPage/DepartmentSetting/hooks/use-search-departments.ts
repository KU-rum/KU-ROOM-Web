import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import useToast from "@hooks/use-toast";
import useDebounce from "@hooks/use-debounce";
import { DepartmentType, getSearchedDepartmentsApi } from "@/apis/department";

import { MYPAGE_QUERY_KEY } from "../../querykey";

export const useSearchDepartments = (searchText: string) => {
  const toast = useToast();
  const debouncedText = useDebounce(searchText, 300);

  const {
    data: searchedDepartmentsData,
    isPending: isPendingSearchedDepartments,
    isError,
    error,
  } = useQuery<DepartmentType[]>({
    queryKey: MYPAGE_QUERY_KEY.SEARCHED_DEPARTMENTS(debouncedText),
    queryFn: () => getSearchedDepartmentsApi(debouncedText),
    enabled: !!debouncedText.trim(),
    staleTime: 1000 * 60 * 3,
  });

  useEffect(() => {
    if (isError)
      toast.error(`학과 검색 중 오류가 발생했습니다. ${error?.message}`);
  }, [isError, error, toast]);

  return {
    debouncedText,
    searchedDepartmentsData,
    isPendingSearchedDepartments,
  };
};
