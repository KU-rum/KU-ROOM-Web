// 지도 관련 api
import axiosInstance from "./axiosInstance";

const GET_CATEGORY_LOCATIONS = "/categories";

interface Building {
  id: number | null;
  abbreviation: string;
  name: string;
  number: number;
  latitude: number;
  longitude: number;
}

interface Place {
  placeId: number;
  name: string;
  latitude: number;
  longitude: number;
  building: Building;
}

interface GetCategoryLocations {
  code: number;
  status: string;
  message: string;
  data: Place[];
}
export const getCategoryLocations = async (category: string) => {
  try {
    const response = await axiosInstance.get<GetCategoryLocations>(
      `${GET_CATEGORY_LOCATIONS}/${category}/places`
    );
    console.log(response.data.data);
    return response.data.data;
  } catch (error: any) {
    console.error("단과대 조회 실패:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "단과대 조회 중 오류 발생"
    );
  }
};
