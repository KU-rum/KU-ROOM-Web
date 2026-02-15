// tanstack query 리팩토링 완료
// 유저의 프로필과 관련된 api
import axios from "axios";
import axiosInstance from "./axiosInstance";
import { ApiResponse } from "@/shared/types";
import { DepartmentType } from "./department";

const CHANGE_NICKNAME_API = "/users/nickname";
const CHANGE_PW_BEFORE_LOGIN_URL = "/users/password-reset/initiate";
const CHANGE_PW_AFTER_LOGIN_URL = "/users/password-reset";
const USER_PROFILE_URL = "/users/profile";
const UPDATE_USER_DEPARTMENTS_URL = "/users/department";
const PRESIGNED_URL = "/users/profile/presigned-url";

// 유저 프로필 정보 가져오는 api
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

export const getUserProfileApi = async () => {
  const response =
    await axiosInstance.get<UserProfileResponse>(USER_PROFILE_URL);

  return response.data;
};

interface ChangeNicknameResponse extends ApiResponse {
  data: string;
}
// 닉네임 변경 api
export const changeNicknameApi = async (nickname: string) => {
  try {
    const response = await axiosInstance.patch<ChangeNicknameResponse>(
      CHANGE_NICKNAME_API,
      {
        nickname,
      },
    );
    return response.data;
  } catch (error: any) {
    console.error("닉네임 변경 실패:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "닉네임 변경 중 오류 발생",
    );
  }
};

export interface ChangePwBeforeLoginRequest {
  emailRequest: {
    email: string;
    code: string;
  };
  loginId: string;
  newPassword: string;
}
interface ChangePwResponse extends ApiResponse {
  data: string;
}

// 로그인 전 비밀번호 변경 (아이디/비밀번호 찾기 시 사용)
export const changePwBeforeLoginApi = async (
  userInfo: ChangePwBeforeLoginRequest,
) => {
  const response = await axiosInstance.post<ChangePwResponse>(
    CHANGE_PW_BEFORE_LOGIN_URL,
    userInfo,
  );
  return response.data; // 성공 응답 반환
};

export interface ChangePwAfterLoginRequest {
  prevPassword: string;
  newPassword: string;
}

// 로그인 후 비밀번호 변경
export const changePwAfterLoginApi = async (
  userInfo: ChangePwAfterLoginRequest,
) => {
  const response = await axiosInstance.post<ChangePwResponse>(
    CHANGE_PW_AFTER_LOGIN_URL,
    userInfo,
  );

  return response.data;
};

// 유저 학과 추가 및 삭제 api
interface UpdateDepartmentResponse extends ApiResponse {
  data: string;
}
export const addDepartmentApi = async (department: string) => {
  const response = await axiosInstance.post<UpdateDepartmentResponse>(
    UPDATE_USER_DEPARTMENTS_URL,
    {
      department,
    },
  );

  return response.data.data;
};
export const deleteDepartmentApi = async (department: string) => {
  const response = await axiosInstance.delete<UpdateDepartmentResponse>(
    UPDATE_USER_DEPARTMENTS_URL,
    {
      data: {
        department,
      },
    },
  );

  return response.data.data;
};

// 프로필 이미지 변경 api
interface UpdateProfileImageResponse extends ApiResponse {
  data: string;
}

export const updateProfileImageApi = async (imageUrl: string | null) => {
  const response = await axiosInstance.patch<UpdateProfileImageResponse>(
    USER_PROFILE_URL,
    {
      imageUrl,
    },
  );

  return response.data;
};

export interface GetProfileImagePresignedUrlData {
  presignedUrl: string;
  fileKey: string;
  fullUrl: string;
}

// 프로필 이미지 관련 presigned url 가져오는 api
interface GetProfileImagePresignedUrlResponse extends ApiResponse {
  data: GetProfileImagePresignedUrlData;
}

export const getProfileImagePresignedUrlApi = async (
  fileName: string,
  fileType: string,
) => {
  const response =
    await axiosInstance.post<GetProfileImagePresignedUrlResponse>(
      PRESIGNED_URL,
      {
        fileName,
        fileType,
      },
    );

  return response.data;
};

// 프로필 이미지 관련 presigned url에 업로드하는 api
export const uploadToProfileImagePresignedUrlApi = async (
  presignedUrl: string,
  file: File,
) => {
  await axios.put(presignedUrl, file, {
    headers: { "Content-Type": file.type || "application/octet-stream" },
  });
};
