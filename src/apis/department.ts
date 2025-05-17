// 단과대 및 학과 조회 api
import axiosInstance from "./axiosInstance";

const GET_ALL_COLLEGES = "/colleges";
const GET_DEPARTMENTS = "/departments?collegeName";

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
      error.response?.data?.message || "단과대 조회 중 오류 발생"
    );
  }
};

// 해당 단과대 내 학과 조회
export const getDepartments = async (college: string) => {
  try {
    const response = await axiosInstance.get<GetCollegesDepartmentsResponse>(
      `${GET_DEPARTMENTS}=${college}`
    );
    // console.log(response.data.data.name);
    return response.data.data.name;
  } catch (error: any) {
    console.error("학과 조회 실패:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "학과 조회 중 오류 발생");
  }
};
