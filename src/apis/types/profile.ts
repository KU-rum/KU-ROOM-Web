import { ApiResponse, DepartmentType } from ".";

export interface UserProfileResponseData {
  profileImage: string | null;
  email: string | null;
  nickname: string;
  loginId: string | null;
  studentId: number;
  departments: DepartmentType[];
}

export interface UserProfileResponse extends ApiResponse {
  data: UserProfileResponseData;
}

export interface ChangeProfileResponse extends ApiResponse {
  data: string;
}

export interface ChangePwBeforeLoginRequest {
  emailRequest: {
    email: string;
    code: string;
  };
  loginId: string;
  newPassword: string;
}

export interface ChangePwAfterLoginRequest {
  prevPassword: string;
  newPassword: string;
}

export interface GetProfileImagePresignedUrlData {
  presignedUrl: string;
  fileKey: string;
  fullUrl: string;
}

export interface GetProfileImagePresignedUrlResponse extends ApiResponse {
  data: GetProfileImagePresignedUrlData;
}
