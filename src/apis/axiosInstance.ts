import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://kuroom.shop/api/v1",
  // body가 있는 요청들의 경우에는 Content-Type: application/json를 명시해주는 것이 좋다.
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      if (!config.headers) config.headers = {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

interface TokenReissueResponse {
  code: number;
  status: string;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAccessTokenExpired = error.response?.status === 401;

    if (isAccessTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("refreshToken 없음");

        const res = await axios.post<TokenReissueResponse>(
          "https://kuroom.shop/api/v1/auth/reissue",
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        const newAccessToken = res.data.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        if (!originalRequest.headers) originalRequest.headers = {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("토큰 재발급 실패:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
