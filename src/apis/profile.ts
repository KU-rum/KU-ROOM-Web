// 유저의 프로필과 관련된 api (닉네임, 비밀번호, 프로필 이미지, 학과 등)
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

// 닉네임 변경 api
export const changeNicknameApi = async (changeNickname: {
  nickname: string;
}) => {
  try {
    const response = await axiosInstance.patch(
      CHANGE_NICKNAME_API,
      changeNickname,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.error("닉네임 변경 실패:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "닉네임 변경 중 오류 발생",
    );
  }
};

interface ChangePwResponse {
  code: number;
  status: string;
  message: string;
  data: string;
}

// 로그인 전 비밀번호 변경 (아이디/비밀번호 찾기 시 사용)
export const changePwBeforeLoginApi = async (userInfo: {
  emailRequest: {
    email: string;
    code: string;
  };
  loginId: string;
  newPassword: string;
}) => {
  try {
    const response = await axiosInstance.post<ChangePwResponse>(
      CHANGE_PW_BEFORE_LOGIN_URL,
      userInfo,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log(response.data);
    return response.data; // 성공 응답 반환
  } catch (error: any) {
    console.error("비밀번호 변경 실패:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "비밀번호 변경 중 오류 발생",
    );
  }
};

// 로그인 후 비밀번호 변경
export const changePwAfterLoginApi = async (userInfo: {
  prevPassword: string;
  newPassword: string;
}) => {
  try {
    const response = await axiosInstance.post<ChangePwResponse>(
      CHANGE_PW_AFTER_LOGIN_URL,
      userInfo,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const { code, message, data } = response.data;

    // 서버 응답 코드 기반 처리
    if (code === 310) {
      return { success: false, code, message };
    }
    if (code === 311) {
      return { success: false, code, message };
    }

    return { success: true, data };
  } catch (error: any) {
    const errData = error.response?.data;
    throw { code: errData?.code, message: errData?.message };
  }
};

export interface UserProfileResponseData {
  profileImage: string | null;
  email: string | null;
  nickname: string;
  loginId: string | null;
  studentId: number;
  departments: DepartmentType[];
}

interface UserProfileResponse extends ApiResponse {
  data: UserProfileResponseData;
}

export const getUserProfileApi = async () => {
  const response =
    await axiosInstance.get<UserProfileResponse>(USER_PROFILE_URL);

  return response.data.data;
};

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

export interface GetPresignedUrlData {
  presignedUrl: string;
  fileKey: string;
  fullUrl: string;
}

interface GetPresignedUrlResponse extends ApiResponse {
  data: GetPresignedUrlData;
}

export const getPresignedUrlApi = async (
  fileName: string,
  fileType: string,
) => {
  const response = await axiosInstance.post<GetPresignedUrlResponse>(
    PRESIGNED_URL,
    {
      fileName,
      fileType,
    },
  );

  return response.data;
};

export const uploadToPresignedUrlApi = async (
  presignedUrl: string,
  file: File,
) => {
  await axios.put(presignedUrl, file, {
    headers: { "Content-Type": file.type },
  });
};
