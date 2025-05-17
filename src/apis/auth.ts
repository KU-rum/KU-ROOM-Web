// 로그인 관련 api
import axiosInstance from "./axiosInstance";

const LOGIN_API_URL = "/auth/login";
const LOGOUT_API_URL = "/auth/logout";
const WITHDRAW_API_URL = "/users/deactivate";

interface LoginResponse {
  code: number;
  status: string;
  message: string;
  data: {
    tokenResponse: {
      accessExpireIn: number;
      accessToken: string;
      refreshExpireIn: number;
      refreshToken: string;
    };
    userResponse: {
      id: number;
      oauthId: string | null;
      loginId: string;
      email: string;
      nickname: string;
      studentId: string;
      imageUrl: string | null;
      departmentResponse: {
        departmentId: number;
        departmentName: string;
      }[];
    };
  };
}

export const loginApi = async (userData: {
  loginId: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post<LoginResponse>(
      LOGIN_API_URL,
      userData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data; // 성공 시 반환
  } catch (error: any) {
    if (error.response?.status === 401) {
      return error.response.data; // 401이면 throw하지 않고 반환
    }
    throw new Error(error.response?.data?.message || "로그인 중 오류 발생"); // 서버 문제(500 등)만 throw
  }
};

// 로그아웃 관련 api
interface LogoutResponse {
  code: number;
  status: string;
  message: string;
  data: string;
}
export const logoutApi = async () => {
  try {
    const response = await axiosInstance.patch<LogoutResponse>(
      LOGOUT_API_URL,
      {} // 요청 바디 없음
    );

    return response.data.data; // 성공 시 반환
  } catch (error: any) {
    if (error.response?.status === 401) {
      return error.response.data; // 401이면 throw하지 않고 반환
    }
    throw new Error(error.response?.data?.message || "로그아웃 중 오류 발생"); // 서버 문제(500 등)만 throw
  }
};

// 회원 탈퇴 관련 api
export const withdrawApi = async () => {
  try {
    const response = await axiosInstance.delete(WITHDRAW_API_URL);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "회원탈퇴 중 오류 발생");
  }
};
