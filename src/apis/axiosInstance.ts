import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { clearAuthStorage } from "@utils/storageUtils";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

type RetriableRequestConfig = AxiosRequestConfig & {
  _retry?: boolean;
};

const REISSUE_PATH = "/auth/reissue";

const isUnauthorizedStatus = (status?: number) => status === 401;
const isUnauthorizedCode = (data: unknown) => {
  if (!data || typeof data !== "object") return false;
  const code = (data as { code?: number | string }).code;
  return Number(code) === 401;
};
const isReissueRequest = (url?: string) => (url ?? "").includes(REISSUE_PATH);

const moveToLogin = () => {
  clearAuthStorage();
  window.location.href = "/login";
};

const retryWithReissue = async (originalRequest: RetriableRequestConfig) => {
  if (originalRequest._retry || isReissueRequest(originalRequest.url)) {
    moveToLogin();
    throw new Error("Unauthorized after retry");
  }

  originalRequest._retry = true;

  try {
    const newAccessToken = await reissueTokenApi();
    originalRequest.headers = {
      ...(originalRequest.headers ?? {}),
      Authorization: `Bearer ${newAccessToken}`,
    };
    return axiosInstance(originalRequest);
  } catch (error) {
    moveToLogin();
    throw error;
  }
};

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
  async (response: AxiosResponse) => {
    if (!isUnauthorizedCode(response.data)) return response;

    const originalRequest = response.config as RetriableRequestConfig;
    return retryWithReissue(originalRequest);
  },
  async (error: AxiosError) => {
    const status = error.response?.status ?? error.status;
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (!isUnauthorizedStatus(status) || !originalRequest) {
      return Promise.reject(error);
    }

    try {
      return await retryWithReissue(originalRequest);
    } catch (e) {
      return Promise.reject(e);
    }
  },
);

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
  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  try {
    const response = await axios.patch<ReissueResponse>(
      `${import.meta.env.VITE_API_BASE_URL}/auth/reissue`,
      { refreshToken },
    );

    if (
      isUnauthorizedStatus(response.status) ||
      isUnauthorizedCode(response.data)
    ) {
      throw new Error("Refresh token expired");
    }

    const tokenData = response.data?.data;
    if (!tokenData?.accessToken || !tokenData?.refreshToken) {
      throw new Error("Invalid reissue response");
    }

    localStorage.setItem("accessToken", tokenData.accessToken);
    localStorage.setItem("refreshToken", tokenData.refreshToken);

    return tokenData.accessToken;
  } catch (err: any) {
    console.warn("토큰 재발급 실패", err.response?.data || err.message);
    throw err;
  }
};

export default axiosInstance;
