import { ApiResponse } from ".";

export interface DepartmentType {
  department: string;
  college: string;
}

export interface GetCollegesDepartmentsResponse extends ApiResponse {
  data: { name: string[] };
}

export interface SearchedDepartmentsResponse extends ApiResponse {
  data: DepartmentType[];
}
