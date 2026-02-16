import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import useToast from "@hooks/use-toast";
import useDebounce from "@hooks/use-debounce";
import {
  getAllCollegesApi,
  getCollegeDepartmentsApi,
  type GetCollegesDepartmentsResponse,
  getSearchedDepartmentsApi,
  type SearchedDepartmentsResponse,
} from "@apis/department";
import { DEPARTMENT_QUERY_KEY } from "@/queryKey";

export const useCollegesQuery = () => {
  const toast = useToast();

  const {
    data,
    isPending: isPendingCollegesData,
    isError,
    error,
  } = useQuery<GetCollegesDepartmentsResponse>({
    queryKey: DEPARTMENT_QUERY_KEY.COLLEGE,
    queryFn: () => getAllCollegesApi(),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (isError)
      toast.error(`단과대 조회 중 오류가 발생했습니다. ${error?.message}`);
  }, [isError, error, toast]);

  const collegesData = data?.data.name;

  return {
    collegesData,
    isPendingCollegesData,
  };
};

export const useCollegeDepartmentsQuery = (college: string) => {
  const toast = useToast();

  const {
    data,
    isPending: isPendingDepartmentsData,
    isError,
    error,
  } = useQuery<GetCollegesDepartmentsResponse>({
    queryKey: DEPARTMENT_QUERY_KEY.DEPARTMENT(college),
    queryFn: () => getCollegeDepartmentsApi(college),
    enabled: !!college,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (isError)
      toast.error(`학과 조회 중 오류가 발생했습니다. ${error?.message}`);
  }, [isError, error, toast]);

  const departmentsData = data?.data.name;

  return {
    departmentsData,
    isPendingDepartmentsData,
  };
};

export const useSearchedDepartmentQuery = (searchText: string) => {
  const toast = useToast();
  const debouncedText = useDebounce(searchText, 300);

  const {
    data,
    isPending: isPendingSearchedDepartments,
    isError,
    error,
  } = useQuery<SearchedDepartmentsResponse>({
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

  const searchedDepartmentsData = data?.data;

  return {
    debouncedText,
    searchedDepartmentsData,
    isPendingSearchedDepartments,
  };
};
