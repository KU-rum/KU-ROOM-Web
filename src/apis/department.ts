// 단과대 및 학과 조회 api
import axiosInstance from "./axiosInstance";
import { ApiResponse } from "@/shared/types";

const GET_ALL_COLLEGES = "/colleges";
const GET_DEPARTMENTS = "/departments?collegeName";
const GET_SEACHRED_DEPARTMENT_URL = "/departments/search";

// 단과대 조회
interface GetCollegesDepartmentsResponse {
  code: number;
  status: string;
  message: string;
  data: { name: string[] };
}
export const getAllColleges = async () => {
  try {
    const response =
      await axiosInstance.get<GetCollegesDepartmentsResponse>(GET_ALL_COLLEGES);
    // console.log(response.data.data.name);
    return response.data.data.name;
  } catch (error: any) {
    console.error("단과대 조회 실패:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "단과대 조회 중 오류 발생",
    );
  }
};

// 해당 단과대 내 학과 조회
export const getDepartments = async (college: string) => {
  try {
    const response = await axiosInstance.get<GetCollegesDepartmentsResponse>(
      `${GET_DEPARTMENTS}=${college}`,
    );
    // console.log(response.data.data.name);
    return response.data.data.name;
  } catch (error: any) {
    console.error("학과 조회 실패:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "학과 조회 중 오류 발생");
  }
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
    GET_SEACHRED_DEPARTMENT_URL,
    { params: { query: searchText } },
  );

  return response.data.data;
};
