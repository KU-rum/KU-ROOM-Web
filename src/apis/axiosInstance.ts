import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

import { clearAuthStorage } from "@utils/storageUtils";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  async (response: any) => {
    if (response.data.code === 401) {
      const originalRequest = response.config as AxiosRequestConfig & {
        _retry?: boolean;
      };
      try {
        const newAccessToken = await reissueTokenApi();
        const headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };
        return axiosInstance({ ...response.config, headers });
      } catch (error: any) {
        console.warn(
          "재발급 실패 (기타 이유)",
          error.response?.data || error.message,
        );
        throw error;
      }
    }
    return response;
  },
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // HTTP 401인 경우만 토큰 재발급 시도
    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await reissueTokenApi();

        originalRequest.headers = {
          ...(originalRequest.headers ?? {}),
          Authorization: `Bearer ${newAccessToken}`,
        };

        return axiosInstance(originalRequest); // 원래 요청 재시도
      } catch (e) {
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  },
);
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
export const reissueTokenApi = async (): Promise<string> => {
  const refreshToken = localStorage.getItem("refreshToken");

  try {
    const response = await axios.patch<ReissueResponse>(
      `${import.meta.env.VITE_API_BASE_URL}/auth/reissue`,
      { refreshToken },
    );

    const tokenData = response.data.data;

    // 이 조건이 중요: refreshToken은 있었지만, 만료되어 data 자체가 안 온 경우.
    // refresh token에 문제가 있는 경우에는 로그인 화면으로 리다이렉트 해야한다.
    if (!tokenData || !tokenData.accessToken) {
      console.error(" refreshToken 만료 또는 재발급 실패 → 로그인 이동");
      clearAuthStorage();
      window.location.href = "/login";
      throw new Error("refreshToken 만료");
    }

    // 정상적으로 accessToken 재발급됨
    localStorage.setItem("accessToken", tokenData.accessToken);
    localStorage.setItem("refreshToken", tokenData.refreshToken);
    console.log(" accessToken 재발급 성공");

    return tokenData.accessToken;
  } catch (err: any) {
    console.warn("재발급 실패 (기타 이유)", err.response?.data || err.message);
    clearAuthStorage();
    throw err;
  }
};

export default axiosInstance;
