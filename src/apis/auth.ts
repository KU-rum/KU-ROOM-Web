import axiosInstance from "./axiosInstance";

const LOGIN_API_URL = "/auth/login";
const LOGOUT_API_URL = "/auth/logout";
const WITHDRAW_API_URL = "/users/deactivate";
const REISSUE_TOKEN_API_URL = "/auth/reissue";
const OAUTH_TOKEN_API_URL = "/auth/token";

interface LoginResponse {
  code: number;
  status: string;
  message: string;
  data: {
    tokenResponse: {
      accessToken: string;
      refreshToken: string;
      accessExpireIn: number;
      refreshExpireIn: number;
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

interface OAuthLoginResponse {
  code: number;
  status: string;
  message: string;
  data: {
    tokenResponse: {
      accessToken: string;
      refreshToken: string;
      accessExpireIn: number;
      refreshExpireIn: number;
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
    isFirstLogin: boolean; // OAuth에서 추가된 필드
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
  // 토큰 필요 시 이렇게 요청
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
    const response = await axiosInstance.delete(WITHDRAW_API_URL, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "회원탈퇴 중 오류 발생");
  }
};

// 토큰 재발급 api
interface ReissueResponse {
  code: number;
  status: string;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    accessExpireIn: number;
    refreshExpireIn: number;
  };
}
export const reissueTokenApi = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  console.log("refresh 토큰으로 재발급 요청: ", refreshToken);
  try {
    const response = await axiosInstance.patch<ReissueResponse>(
      REISSUE_TOKEN_API_URL,
      {
        refreshToken: refreshToken,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log("access token 재발급함");
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "회원탈퇴 중 오류 발생");
  }
};

// 임시 토큰(authCode)으로 실제 토큰 발급받는 API
export const getTokenByAuthCode = async (authCode: string) => {
  try {
    const response = await axiosInstance.post<OAuthLoginResponse>(
      OAUTH_TOKEN_API_URL,
      null,
      {
        params: { authCode },
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data; // 성공 시 반환
  } catch (error: any) {
    if (error.response?.status === 401) {
      return error.response.data; // 401이면 throw하지 않고 반환
    }
    throw new Error(
      error.response?.data?.message || "OAuth 토큰 교환 중 오류 발생"
    );
  }
};
