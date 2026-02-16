import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import useToast from "@hooks/use-toast";
import useDebounce from "@hooks/use-debounce";
import { getSearchedDepartmentsApi } from "@apis/department";
import { DEPARTMENT_QUERY_KEY } from "@/queryKey";

export const useSearchedDepartmentQuery = (searchText: string) => {
  const toast = useToast();
  const debouncedText = useDebounce(searchText, 300);

  const {
    data: searchedDepartmentsData,
    isPending: isPendingSearchedDepartments,
    isError,
    error,
  } = useQuery({
    queryKey: DEPARTMENT_QUERY_KEY.SEARCHED_DEPARTMENT(searchText),
    queryFn: () => getSearchedDepartmentsApi(searchText),
    enabled: !!debouncedText.trim(),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
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
