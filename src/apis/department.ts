// tanstack query 리팩토링 완료
// 단과대 및 학과 조회 api
import axiosInstance from "./axiosInstance";
import {
  GetCollegesDepartmentsResponse,
  SearchedDepartmentsResponse,
} from "./types";

const GET_ALL_COLLEGES = "/colleges";
const GET_DEPARTMENTS = "/departments";
const GET_SEARCHED_DEPARTMENT_URL = "/departments/search";

// 단과대 조회
export const getAllCollegesApi = async () => {
  const response =
    await axiosInstance.get<GetCollegesDepartmentsResponse>(GET_ALL_COLLEGES);
  return response.data;
};

// 해당 단과대 내 학과 조회
export const getCollegeDepartmentsApi = async (college: string) => {
  const response = await axiosInstance.get<GetCollegesDepartmentsResponse>(
    GET_DEPARTMENTS,
    {
      params: {
        collegeName: college,
      },
    },
  );
  return response.data;
};

// 학과 검색 api
export const getSearchedDepartmentsApi = async (searchText: string) => {
  const response = await axiosInstance.get<SearchedDepartmentsResponse>(
    GET_SEARCHED_DEPARTMENT_URL,
    { params: { query: searchText } },
  );

  return response.data;
};
