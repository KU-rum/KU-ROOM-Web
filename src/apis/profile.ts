// tanstack query 리팩토링 완료
// 유저의 프로필과 관련된 api
import axios from "axios";
import axiosInstance from "./axiosInstance";
import {
  ChangeProfileResponse,
  ChangePwAfterLoginRequest,
  ChangePwBeforeLoginRequest,
  GetProfileImagePresignedUrlResponse,
  UserProfileResponse,
} from "./types";

const CHANGE_NICKNAME_URL = "/users/nickname";
const CHANGE_PW_BEFORE_LOGIN_URL = "/users/password-reset/initiate";
const CHANGE_PW_AFTER_LOGIN_URL = "/users/password-reset";
const USER_PROFILE_URL = "/users/profile";
const UPDATE_USER_DEPARTMENTS_URL = "/users/department";
const PRESIGNED_URL = "/users/profile/presigned-url";

// 유저 프로필 정보 가져오는 api
export const getUserProfileApi = async () => {
  const response =
    await axiosInstance.get<UserProfileResponse>(USER_PROFILE_URL);

  return response.data;
};

// 닉네임 변경 api
export const changeNicknameApi = async (nickname: string) => {
  const response = await axiosInstance.patch<ChangeProfileResponse>(
    CHANGE_NICKNAME_URL,
    {
      nickname,
    },
  );
  return response.data;
};

// 로그인 전 비밀번호 변경 (아이디/비밀번호 찾기 시 사용)
export const changePwBeforeLoginApi = async (
  userInfo: ChangePwBeforeLoginRequest,
) => {
  const response = await axiosInstance.post<ChangeProfileResponse>(
    CHANGE_PW_BEFORE_LOGIN_URL,
    userInfo,
  );
  return response.data; // 성공 응답 반환
};

// 로그인 후 비밀번호 변경
export const changePwAfterLoginApi = async (
  userInfo: ChangePwAfterLoginRequest,
) => {
  const response = await axiosInstance.post<ChangeProfileResponse>(
    CHANGE_PW_AFTER_LOGIN_URL,
    userInfo,
  );

  return response.data;
};

// 학과 추가 api
export const addDepartmentApi = async (department: string) => {
  const response = await axiosInstance.post<ChangeProfileResponse>(
    UPDATE_USER_DEPARTMENTS_URL,
    {
      department,
    },
  );

  return response.data.data;
};

// 학과 삭제 api
export const deleteDepartmentApi = async (department: string) => {
  const response = await axiosInstance.delete<ChangeProfileResponse>(
    UPDATE_USER_DEPARTMENTS_URL,
    {
      data: {
        department,
      },
    },
  );

  return response.data.data;
};

export const updateProfileImageApi = async (imageUrl: string | null) => {
  const response = await axiosInstance.patch<ChangeProfileResponse>(
    USER_PROFILE_URL,
    {
      imageUrl,
    },
  );

  return response.data;
};

// 프로필 이미지 관련 presigned url 가져오는 api
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
