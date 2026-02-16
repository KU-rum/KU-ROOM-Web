// 단과대 및 학과 조회 api
import axiosInstance from "./axiosInstance";
import { ApiResponse } from "@/shared/types";

const GET_ALL_COLLEGES = "/colleges";
const GET_DEPARTMENTS = "/departments?collegeName";
const GET_SEARCHED_DEPARTMENT_URL = "/departments/search";

// 단과대 조회
interface GetCollegesDepartmentsResponse extends ApiResponse {
  data: { name: string[] };
}
export const getAllCollegesApi = async () => {
  const response =
    await axiosInstance.get<GetCollegesDepartmentsResponse>(GET_ALL_COLLEGES);
  return response.data.data.name;
};

// 해당 단과대 내 학과 조회
export const getCollegeDepartmentsApi = async (college: string) => {
  const response = await axiosInstance.get<GetCollegesDepartmentsResponse>(
    `${GET_DEPARTMENTS}=${college}`,
  );
  return response.data.data.name;
};

export interface DepartmentType {
  department: string;
  college: string;
}

interface SearchedDepartmentsResponse extends ApiResponse {
  data: DepartmentType[];
}

export const getSearchedDepartmentsApi = async (searchText: string) => {
  const response = await axiosInstance.get<SearchedDepartmentsResponse>(
    GET_SEARCHED_DEPARTMENT_URL,
    { params: { query: searchText } },
  );

  return response.data.data;
};
