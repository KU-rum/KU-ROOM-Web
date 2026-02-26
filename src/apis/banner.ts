// tanstack query 리팩토링 완료
// 친구 관련 api
import axiosInstance from "./axiosInstance";
import { GetBannersResponse } from "./types";

const GET_BANNERS = "/banner";

// 배너 목록 조회 api
export const getBannersApi = async () => {
  const response = await axiosInstance.get<GetBannersResponse>(GET_BANNERS);
  return response.data;
};
